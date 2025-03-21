<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseMap :init-map="simpleMapInit" @map-ready="mapReady" />
</template>

<script lang="ts" setup>
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ref, watch } from 'vue';
import BaseMap from '../BaseMap.vue';
import { LatLngPosition } from '../types';
import { handleMapAttribution, initMap } from '../utils';

const emit = defineEmits<{
  (e: 'mapClick', latLng: LatLngPosition): void;
}>();

const props = withDefaults(
  defineProps<{
    markers: LatLngPosition[];
    center?: LatLngPosition;
    zoom?: number;
    enableSetMarker?: boolean;
    hideAttribution?: boolean;
  }>(),
  {
    center: undefined,
    zoom: undefined,
    enableSetMarker: false,
    hideAttribution: false,
  }
);

const map = ref<Map>();

const simpleMapInit = (mapId: string) =>
  initMap(mapId, {
    center: props.center,
    zoom: props.zoom,
  });

const mapReady = (readyMap: Map) => {
  map.value = readyMap;
  map.value.on('click', (event) => emit('mapClick', event.lngLat));
};

// Draw and update markers
let currentMarkers: Marker[] = [];
watch([map, () => props.markers], ([mapValue, markers]) => {
  if (mapValue == null) {
    console.error('Map is null');
    return;
  }

  currentMarkers.forEach((marker) => marker.remove());
  currentMarkers = [];

  markers.forEach((marker) => {
    const newMarker = new Marker().setLngLat(marker).addTo(mapValue);
    currentMarkers.push(newMarker);
  });
});

// Set cursor depending on enableSetMarker
watch([map, () => props.enableSetMarker], ([mapValue, enableSetMarker]) => {
  if (mapValue == null) {
    console.error('Map is null');
    return;
  }

  mapValue.getCanvas().style.cursor = enableSetMarker ? 'crosshair' : '';
});

// Show / hide attribution
handleMapAttribution(map, props.hideAttribution);
</script>
