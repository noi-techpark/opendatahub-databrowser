<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="relative h-full w-full">
    <div
      v-if="!mapLoaded"
      class="absolute inset-0 flex items-center justify-center transition-all"
    >
      <IconCycle class="animate-spin text-dialog" />
    </div>
    <div :id="mapId" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onMounted, ref } from 'vue';
import IconCycle from '../svg/IconCycle.vue';
import { randomId } from '../utils/random';

const props = defineProps<{
  initMap: (mapId: string) => Map;
}>();

const emit = defineEmits<{ (e: 'mapReady', map: Map): void }>();

const mapId = ref(`map-${randomId()}`);
const map = ref<Map>();
const mapLoaded = ref(false);

onMounted(() => {
  map.value = props.initMap(mapId.value);

  map.value.on('load', () => {
    if (map.value?.loaded()) {
      mapLoaded.value = true;
      emit('mapReady', map.value);
    }
  });
});
</script>
