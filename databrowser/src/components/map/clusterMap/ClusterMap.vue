<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseMap :init-map="clusterMapInit" @map-ready="mapReady" />
</template>

<script setup lang="ts">
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ref, toRefs } from 'vue';
import BaseMap from '../BaseMap.vue';
import { LatLngPosition } from '../types';
import { handleMapAttribution, initMap } from '../utils';
import { ClusterMapInitializer } from './types';

const props = withDefaults(
  defineProps<{
    initClusterMap: ClusterMapInitializer;
    center?: LatLngPosition;
    zoom?: number;
    hideAttribution?: boolean;
  }>(),
  {
    center: undefined,
    zoom: undefined,
    hideAttribution: false,
  }
);

const { center, zoom } = toRefs(props);

const map = ref<Map>();

const clusterMapInit = (mapId: string) => {
  return initMap(mapId, {
    center: center.value,
    zoom: zoom.value,
  });
};

const mapReady = (readyMap: Map) => {
  map.value = readyMap;
  props.initClusterMap(map.value);
};

// Show / hide attribution
handleMapAttribution(map, props.hideAttribution);
</script>
