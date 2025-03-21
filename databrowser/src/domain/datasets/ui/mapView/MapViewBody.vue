<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex h-full gap-4 overflow-y-auto overflow-x-hidden md:px-6 md:pb-6"
  >
    <DatasetFilter
      :class="[showFilter ? 'basis-11/12 md:basis-1/4' : 'hidden md:basis-1/4']"
    />
    <div
      class="relative h-full w-full md:basis-3/4"
      :class="[{ 'basis-1/12': showFilter }]"
      @click="showFilter = false"
    >
      <div
        v-if="showMarkerDetail"
        class="absolute bottom-0 z-30 h-4/5 w-full max-w-[40rem] overflow-y-auto overflow-x-hidden p-2 md:bottom-auto md:w-1/3 md:min-w-[25rem]"
      >
        <RecordDetail
          v-if="showMarkerDetail"
          id="record-detail"
          :active-marker="activeMarker"
          :active-cluster="activeCluster"
          @close="closeRecordDetail"
        />
      </div>
      <ClusterMap
        :init-cluster-map="initClusterMap"
        :center="{ lat: mapCenter[1], lng: mapCenter[0] }"
        :zoom="mapZoom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { defineAsyncComponent } from 'vue';
import { useMapViewInitializer } from './cluster/useMapViewInitializer';
import RecordDetail from './detail/RecordDetail.vue';
import DatasetFilter from './filter/DatasetFilter.vue';
import { useMapViewStore } from './store/useMapViewStore';
import { useMapViewUiStore } from './store/useMapViewUiStore';
import { ClusterFeature, MarkerFeature } from './types';

// Dynamically import SimpleMap to improve code chunking
const ClusterMap = defineAsyncComponent(() =>
  import('../../../../components/map/clusterMap/ClusterMap.vue').then(
    (exports) => exports.default
  )
);

const {
  showFilter,
  showMarkerDetail,
  activeMarker,
  activeCluster,
  activeRecord,
  mapCenter,
  mapZoom,
} = storeToRefs(useMapViewUiStore());

const markerClick = (marker: MarkerFeature) => {
  activeCluster.value = undefined;
  activeMarker.value = marker;
  activeRecord.value = marker;
  showMarkerDetail.value = true;
};

const clusterClick = (feature: ClusterFeature) => {
  activeMarker.value = undefined;
  activeRecord.value = undefined;
  activeCluster.value = { ...feature, markers: feature.markers };
  showMarkerDetail.value = true;
};

const closeRecordDetail = () => {
  showMarkerDetail.value = false;
  activeMarker.value = undefined;
  activeRecord.value = undefined;
  activeCluster.value = undefined;
};

const { selectedAndLoadedDatasets } = storeToRefs(useMapViewStore());

// Build map initializer function that is passed to the ClusterMap component
const { initClusterMap } = useMapViewInitializer(
  selectedAndLoadedDatasets,
  activeMarker,
  activeCluster,
  markerClick,
  clusterClick
);
</script>

<style>
/* Special class for "cutting" the map marker icons to the right shape with clip-path  */
.clip-marker-icon-clip {
  clip-path: url(#marker-icon-clip);
}
</style>
