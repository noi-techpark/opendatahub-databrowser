// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { GeoJSONSource, Map, Map as MapLibre } from 'maplibre-gl';
import { Ref, watch } from 'vue';
import {
  ClusterMapLayerTracker,
  LayerId,
} from '../../../../../components/map/clusterMap/types';
import { MapDataset, MapSourcesByGeometryType, MapSourceSpecification } from '../types';

// Legacy source naming (for backward compatibility)
const buildSourceName = (id: string) => `markers-${id}`;

// Multi-geometry source naming
const buildClusterSourceName = (id: string) => `cluster-${id}`;
const buildLineSourceName = (id: string) => `geometry-line-${id}`;
const buildPolygonSourceName = (id: string) => `geometry-polygon-${id}`;

// Layer ID builders
const buildUnclusteredId = (source: string) => `unclustered-${source}`;
const buildClusteredId = (source: string) => `clustered-${source}`;
const buildLineLayerId = (source: string) => `geometry-line-${source}`;
const buildPolygonFillLayerId = (source: string) => `geometry-polygon-fill-${source}`;
const buildPolygonStrokeLayerId = (source: string) => `geometry-polygon-stroke-${source}`;

/**
 * Type guard to check if source is multi-geometry
 */
export const isMultiGeometrySource = (
  source: MapSourceSpecification | MapSourcesByGeometryType
): source is MapSourcesByGeometryType => {
  return 'points' in source || 'lines' in source || 'polygons' in source;
};

export const useMapViewLayerHandler = (
  map: Map,
  sources: Ref<MapDataset[]>,
  mapLayerTracker: ClusterMapLayerTracker,
  onLayerChangesDone: () => void
) => {
  const { layerIdsByDatasetId, addLayerId, removeLayerId, hasLayerId } =
    mapLayerTracker;

  // Add or remove layers from the map when the sources change
  watch(
    sources,
    () => {
      // Remove unused layers from map
      removeUnusedLayers(
        map,
        sources.value,
        layerIdsByDatasetId,
        removeLayerId
      );

      // Add new layers to map
      sources.value
        // Filter out sources that are already in mapClusters
        // IMPORTANT: this is a performance optimization based on the
        // assumption that the data delivered by the API does not change.
        // If the data changes, this must be adapted.
        .filter(({ metaData }) => !hasLayerId(metaData.datasetId))
        .forEach((source) => addNewLayers(map, source, addLayerId));

      // Emit event when all layer changes are done
      map.once('idle', onLayerChangesDone);
    },
    { immediate: true }
  );
};

const removeUnusedLayers = (
  map: MapLibre,
  sources: MapDataset[],
  layerIdsByDatasetId: Ref<Record<string, LayerId>>,
  removeLayerId: (datasetId: string) => void
) => {
  const newSourceIds = new Set(
    sources.map((source) => source.metaData.datasetId)
  );

  for (const sourceId of Object.keys(layerIdsByDatasetId.value)) {
    if (!newSourceIds.has(sourceId)) {
      // Try to remove all possible layer types (both legacy and multi-geometry)
      const layersToRemove = [
        // Legacy layers
        buildClusteredId(sourceId),
        buildUnclusteredId(sourceId),
        // Multi-geometry layers
        buildLineLayerId(sourceId),
        buildPolygonFillLayerId(sourceId),
        buildPolygonStrokeLayerId(sourceId),
      ];

      for (const layerId of layersToRemove) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }

      // Remove sources
      const sourcesToRemove = [
        buildSourceName(sourceId),
        buildClusterSourceName(sourceId),
        buildLineSourceName(sourceId),
        buildPolygonSourceName(sourceId),
      ];

      for (const sourceName of sourcesToRemove) {
        if (map.getSource(sourceName)) {
          map.removeSource(sourceName);
        }
      }

      removeLayerId(sourceId);
    }
  }
};

const addNewLayers = (
  map: MapLibre,
  dataset: MapDataset,
  addLayerId: (datasetId: string, layerId: LayerId) => void
) => {
  const { records } = dataset;

  // Check if this is a multi-geometry source
  if (isMultiGeometrySource(records.source)) {
    addMultiGeometryLayers(map, dataset, addLayerId);
  } else {
    addLegacyLayers(map, dataset, addLayerId);
  }
};

/**
 * Add legacy layers (original behavior for Point geometries)
 */
const addLegacyLayers = (
  map: MapLibre,
  dataset: MapDataset,
  addLayerId: (datasetId: string, layerId: LayerId) => void
) => {
  const { metaData, records } = dataset;
  const { datasetId } = metaData;
  const sourceName = buildSourceName(datasetId);

  const sourceOnMap = map.getSource(sourceName) as GeoJSONSource;

  if (sourceOnMap == null) {
    map.addSource(sourceName, records.source as MapSourceSpecification);
  } else {
    sourceOnMap.setData((records.source as MapSourceSpecification).data);
  }

  // Add cluster layers
  const clusteredId = buildClusteredId(datasetId);
  const unclusteredId = buildUnclusteredId(datasetId);

  // Add cluster layer
  map.addLayer({
    id: clusteredId,
    type: 'circle',
    source: sourceName,
    filter: ['has', 'point_count'],
    paint: { 'circle-radius': 0 },
    metadata: metaData,
  });

  // Add unclustered layer
  map.addLayer({
    id: unclusteredId,
    type: 'circle',
    source: sourceName,
    filter: ['!', ['has', 'point_count']],
    paint: { 'circle-radius': 0 },
    metadata: metaData,
  });

  // Add the layer IDs to tracker
  addLayerId(datasetId, {
    clusteredId,
    unclusteredId,
  });
};

/**
 * Add multi-geometry layers (new behavior for mixed geometry types)
 * Creates cluster source + geometry sources with adaptive zoom visibility
 */
const addMultiGeometryLayers = (
  map: MapLibre,
  dataset: MapDataset,
  addLayerId: (datasetId: string, layerId: LayerId) => void
) => {
  const { metaData, records } = dataset;
  const { datasetId, datasetColor } = metaData;
  const sources = records.source as MapSourcesByGeometryType;

  // Add cluster source (contains representative points for ALL geometries)
  if (sources.points) {
    const clusterSourceName = buildClusterSourceName(datasetId);
    const clusterSourceOnMap = map.getSource(clusterSourceName) as GeoJSONSource;

    if (clusterSourceOnMap == null) {
      map.addSource(clusterSourceName, sources.points);
    } else {
      clusterSourceOnMap.setData(sources.points.data);
    }

    // Add cluster layers (for clustering visualization)
    const clusteredId = buildClusteredId(datasetId);
    const unclusteredId = buildUnclusteredId(datasetId);

    map.addLayer({
      id: clusteredId,
      type: 'circle',
      source: clusterSourceName,
      filter: ['has', 'point_count'],
      paint: { 'circle-radius': 0 },
      metadata: metaData,
    });

    map.addLayer({
      id: unclusteredId,
      type: 'circle',
      source: clusterSourceName,
      filter: ['!', ['has', 'point_count']],
      paint: { 'circle-radius': 0 },
      metadata: metaData,
    });

    // Add the layer IDs to tracker
    addLayerId(datasetId, {
      clusteredId,
      unclusteredId,
    });
  }

  // Add line source and layer (actual LineString geometries)
  if (sources.lines) {
    const lineSourceName = buildLineSourceName(datasetId);
    const lineSourceOnMap = map.getSource(lineSourceName) as GeoJSONSource;

    if (lineSourceOnMap == null) {
      map.addSource(lineSourceName, sources.lines);
    } else {
      lineSourceOnMap.setData(sources.lines.data);
    }

    // Add line layer with adaptive minzoom from feature properties
    map.addLayer({
      id: buildLineLayerId(datasetId),
      type: 'line',
      source: lineSourceName,
      // Filter by minZoom property (each feature has its own minZoom based on size)
      filter: ['<=', ['get', 'minZoom'], ['zoom']],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': datasetColor,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 2,  // Width at zoom 10
          16, 4,  // Width at zoom 16
        ],
        'line-opacity': 0.8,
      },
      metadata: metaData,
    });
  }

  // Add polygon source and layers (actual Polygon geometries)
  if (sources.polygons) {
    const polygonSourceName = buildPolygonSourceName(datasetId);
    const polygonSourceOnMap = map.getSource(polygonSourceName) as GeoJSONSource;

    if (polygonSourceOnMap == null) {
      map.addSource(polygonSourceName, sources.polygons);
    } else {
      polygonSourceOnMap.setData(sources.polygons.data);
    }

    // Add polygon fill layer
    map.addLayer({
      id: buildPolygonFillLayerId(datasetId),
      type: 'fill',
      source: polygonSourceName,
      // Filter by minZoom and maxZoom properties
      // Show only when: currentZoom >= minZoom AND currentZoom <= maxZoom
      filter: [
        'all',
        ['<=', ['get', 'minZoom'], ['zoom']],
        ['>=', ['get', 'maxZoom'], ['zoom']],
      ],
      paint: {
        'fill-color': datasetColor,
        'fill-opacity': 0.02,
      },
      metadata: metaData,
    });

    // Add polygon stroke layer
    map.addLayer({
      id: buildPolygonStrokeLayerId(datasetId),
      type: 'line',
      source: polygonSourceName,
      // Filter by minZoom and maxZoom properties
      filter: [
        'all',
        ['<=', ['get', 'minZoom'], ['zoom']],
        ['>=', ['get', 'maxZoom'], ['zoom']],
      ],
      paint: {
        'line-color': datasetColor,
        'line-width': 2,
      },
      metadata: metaData,
    });
  }
};
