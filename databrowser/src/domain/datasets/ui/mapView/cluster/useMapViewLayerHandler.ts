// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { GeoJSONSource, Map, Map as MapLibre } from 'maplibre-gl';
import { Ref, watch } from 'vue';
import {
  ClusterMapLayerTracker,
  LayerId,
} from '../../../../../components/map/clusterMap/types';
import { MapDataset } from '../types';

const buildSourceName = (id: string) => `markers-${id}`;

const buildUnclusteredId = (source: string) => `unclustered-${source}`;

const buildClusteredId = (source: string) => `clustered-${source}`;

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
      map.removeLayer(buildClusteredId(sourceId));
      map.removeLayer(buildUnclusteredId(sourceId));
      removeLayerId(sourceId);
    }
  }
};

const addNewLayers = (
  map: MapLibre,
  source: MapDataset,
  addLayerId: (datasetId: string, layerId: LayerId) => void
) => {
  const { metaData, records } = source;
  const { datasetId } = metaData;
  const sourceName = buildSourceName(datasetId);

  const sourceOnMap = map.getSource(sourceName) as GeoJSONSource;

  if (sourceOnMap == null) {
    map.addSource(sourceName, records.source);
  } else {
    sourceOnMap.setData(records.source.data);
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

  // Add the layer IDs to  tracker
  addLayerId(datasetId, {
    clusteredId,
    unclusteredId,
  });
};
