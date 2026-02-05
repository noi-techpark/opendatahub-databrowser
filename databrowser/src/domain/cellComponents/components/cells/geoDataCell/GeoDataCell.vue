<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isAnyPropertySet && defaultEntry" class="flex w-full flex-col gap-3">
    <div class="flex gap-5">
      <div class="w-36">
          <GeoDataMap
            class="h-24"
            :prevent-interaction="false"
            :fullscreen-on-click="false"
            :wkt="defaultEntry.Geometry"
          />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { GeoData } from '../editGeoDataCell/types';

// Dynamically import WktMap
const GeoDataMap = defineAsyncComponent(() =>
  import('../editGeoDataCell/GeoDataMap.vue').then(
    (exports) => exports.default
  )
);

const props = defineProps<{
  geoData?: GeoData;
}>();

// Find the default GeoDataEntry
const defaultEntry = computed(() => {
  if (!props.geoData) return null;

  // Find entry where Default === true
  const entries = Object.values(props.geoData);
  return entries.find((entry) => entry.Default === true) || null;
});

const isAnyPropertySet = computed(() => {
  // Return true only if there's a default entry with geometry
  return defaultEntry.value != null && defaultEntry.value.Geometry != null;
});
</script>
