// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Map } from 'maplibre-gl';
import { computed, Ref, watch } from 'vue';
import { ClusterMapInitializer } from '../../../../../components/map/clusterMap/types';
import { useClusterMapLayerTracker } from '../../../../../components/map/clusterMap/useClusterMapLayerTracker';
import { ClusterFeature, MapDataset, MapDatasetMetaData, MarkerFeature } from '../types';
import { useMapViewLayerHandler } from './useMapViewLayerHandler';
import { useMapViewMarkerPainting } from './useMapViewMarkerPainting';
import { storeToRefs } from 'pinia';
import { useMapViewUiStore } from '../store/useMapViewUiStore';

export const useMapViewInitializer = (
  datasets: Ref<Record<string, MapDataset>>,
  activeMarker: Ref<MarkerFeature | undefined>,
  activeCluster: Ref<ClusterFeature | undefined>,
  markerClick: (feature: MarkerFeature) => void,
  clusterClick: (feature: ClusterFeature) => void
): {
  initClusterMap: ClusterMapInitializer;
} => {
  const { mapCenter, mapZoom } = storeToRefs(useMapViewUiStore());

  const initClusterMap = (map: Map) => {
    const clusterMap = useClusterMap(
      map,
      datasets,
      activeMarker,
      activeCluster,
      markerClick,
      clusterClick
    );

    map.on('moveend', () => {
      const center = map.getCenter();
      mapCenter.value = [center.lng, center.lat];
      mapZoom.value = map.getZoom();
      clusterMap.paintMarkers(map);
    });

    // Add click handlers for line and polygon layers
    map.on('click', (e) => {
      // Get all layer IDs for lines and polygons
      const allLayers = map.getStyle().layers;
      const lineLayerIds = allLayers
        .filter((layer) => layer.id.startsWith('geometry-line-'))
        .map((layer) => layer.id);
      const polygonLayerIds = allLayers
        .filter(
          (layer) =>
            layer.id.startsWith('geometry-polygon-fill-') ||
            layer.id.startsWith('geometry-polygon-stroke-')
        )
        .map((layer) => layer.id);

      // Query features at click point
      const features = map.queryRenderedFeatures(e.point, {
        layers: [...lineLayerIds, ...polygonLayerIds],
      });

      if (features.length > 0) {
        const feature = features[0];
        const metadata = feature.layer.metadata as MapDatasetMetaData;

        // Create marker feature from the geometry feature
        const markerFeature: MarkerFeature = {
          recordId: feature.properties?.recordId,
          name: feature.properties?.recordName || 'Unknown',
          datasetId: metadata?.datasetId,
          abbreviation: metadata?.datasetAbbreviation,
          color: metadata?.datasetColor,
        };

        markerClick(markerFeature);
      }
    });

    // Change cursor to pointer when hovering over lines/polygons
    map.on('mousemove', (e) => {
      const allLayers = map.getStyle().layers;
      const geometryLayerIds = allLayers
        .filter(
          (layer) =>
            layer.id.startsWith('geometry-line-') ||
            layer.id.startsWith('geometry-polygon-')
        )
        .map((layer) => layer.id);

      const features = map.queryRenderedFeatures(e.point, {
        layers: geometryLayerIds,
      });

      map.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';
    });

    return clusterMap;
  };

  return { initClusterMap };
};

const useClusterMap = (
  map: Map,
  datasets: Ref<Record<string, MapDataset>>,
  activeMarker: Ref<MarkerFeature | undefined>,
  activeCluster: Ref<ClusterFeature | undefined>,
  markerClick: (feature: MarkerFeature) => void,
  clusterClick: (feature: ClusterFeature) => void
) => {
  // Keep track of layers on the map
  const mapLayerTracker = useClusterMapLayerTracker();

  // Paint markers on the map
  const { paintMarkers } = useMapViewMarkerPainting(
    mapLayerTracker.layerIds,
    activeMarker,
    activeCluster,
    markerClick,
    clusterClick
  );

  const onLayerChangesDone = () => {
    // Repaint markers after all layer changes are applied
    if (map != null) {
      paintMarkers(map);
    }
  };

  const sources = computed<MapDataset[]>(() => {
    return Object.values(datasets.value);
  });

  useMapViewLayerHandler(map, sources, mapLayerTracker, onLayerChangesDone);

  // Repaint markers when the current active marker / cluster changes
  watch([activeMarker, activeCluster], () => {
    if (map != null) {
      paintMarkers(map);
      // Update geometry layer highlighting
      updateGeometryLayerHighlighting(map, activeMarker.value?.recordId);
    }
  });

  return { paintMarkers };
};

/**
 * Update paint properties for line and polygon layers to highlight the active geometry
 */
const updateGeometryLayerHighlighting = (
  map: Map,
  activeRecordId?: string
) => {
  const allLayers = map.getStyle().layers;
  const activeId = activeRecordId ?? '';

  // Update line layers
  const lineLayerIds = allLayers
    .filter((layer) => layer.id.startsWith('geometry-line-'))
    .map((layer) => layer.id);

  for (const layerId of lineLayerIds) {
    // Update line width with active state
    map.setPaintProperty(layerId, 'line-width', [
      'interpolate',
      ['linear'],
      ['zoom'],
      10,
      ['case', ['==', ['get', 'recordId'], activeId], 5, 2],
      16,
      ['case', ['==', ['get', 'recordId'], activeId], 8, 4],
    ]);

    // Update line opacity with active state
    map.setPaintProperty(layerId, 'line-opacity', [
      'case',
      ['==', ['get', 'recordId'], activeId],
      1, // Full opacity when selected
      0.8, // Normal opacity
    ]);
  }

  // Update polygon fill layers
  const polygonFillLayerIds = allLayers
    .filter((layer) => layer.id.startsWith('geometry-polygon-fill-'))
    .map((layer) => layer.id);

  for (const layerId of polygonFillLayerIds) {
    // Update fill color with active state
    map.setPaintProperty(layerId, 'fill-opacity', [
      'case',
      ['==', ['get', 'recordId'], activeId],
      0.6, // More visible when selected
      0.02, // Very subtle normally
    ]);
  }

  // Update polygon stroke layers
  const polygonStrokeLayerIds = allLayers
    .filter((layer) => layer.id.startsWith('geometry-polygon-stroke-'))
    .map((layer) => layer.id);

  for (const layerId of polygonStrokeLayerIds) {
    // Update stroke width with active state
    map.setPaintProperty(layerId, 'line-width', [
      'case',
      ['==', ['get', 'recordId'], activeId],
      5, // Thicker when selected
      2, // Normal width
    ]);

    // Update stroke opacity with active state
    map.setPaintProperty(layerId, 'line-opacity', [
      'case',
      ['==', ['get', 'recordId'], activeId],
      1, // Full opacity when selected
      0.8, // Normal opacity
    ]);
  }
};
