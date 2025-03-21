// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Map } from 'maplibre-gl';
import { computed, Ref, watch } from 'vue';
import { ClusterMapInitializer } from '../../../../../components/map/clusterMap/types';
import { useClusterMapLayerTracker } from '../../../../../components/map/clusterMap/useClusterMapLayerTracker';
import { ClusterFeature, MapDataset, MarkerFeature } from '../types';
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
    }
  });

  return { paintMarkers };
};
