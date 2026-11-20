<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Static preview of a map position: an image rendered by the shared snapshot
  map with a marker on top. It doesn't need its own WebGL context, so it can be
  shown many times on the same page (e.g. in every table row).
-->

<template>
  <div ref="target" class="relative h-24 w-full overflow-hidden bg-gray-100">
    <template v-if="state === 'ready'">
      <img
        :src="src"
        alt=""
        class="size-full object-cover"
        :width="snapshotWidth"
        :height="snapshotHeight"
      />
      <!-- The image is centered on the position, so the pin tip goes there -->
      <IconLocationOn
        class="absolute top-1/2 left-1/2 h-6 w-5 -translate-x-1/2 -translate-y-full text-green-400 drop-shadow"
      />
    </template>
    <div
      v-else-if="state === 'error'"
      class="flex size-full items-center justify-center gap-1 text-sm"
    >
      <IconLocationOn class="size-4 shrink-0 text-green-400" />
      {{ formatCoordinate(position.lat) }}, {{ formatCoordinate(position.lng) }}
    </div>
    <div v-else class="size-full animate-pulse bg-gray-200"></div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { ref, watch } from 'vue';
import IconLocationOn from '../../svg/IconLocationOn.vue';
import { LatLngPosition } from '../types';
import { getMapSnapshot, snapshotHeight, snapshotWidth } from './mapSnapshot';

const props = withDefaults(
  defineProps<{ position: LatLngPosition; zoom?: number }>(),
  { zoom: 12 }
);

const target = ref<HTMLElement>();
const isVisible = ref(false);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const src = ref<string>();

// Only request snapshots for previews that are (or were) on screen
const { stop } = useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    isVisible.value = true;
    stop();
  }
});

let requestId = 0;
watch(
  [
    isVisible,
    () => props.position.lat,
    () => props.position.lng,
    () => props.zoom,
  ],
  async () => {
    if (!isVisible.value) {
      return;
    }

    const currentRequest = ++requestId;
    state.value = 'loading';
    try {
      const snapshot = await getMapSnapshot(props.position, props.zoom);
      if (currentRequest === requestId) {
        src.value = snapshot;
        state.value = 'ready';
      }
    } catch (error) {
      console.error('Unable to render map preview', error);
      if (currentRequest === requestId) {
        state.value = 'error';
      }
    }
  },
  { immediate: true }
);

const formatCoordinate = (value: number) =>
  Number.isFinite(value) ? value.toFixed(5) : '-';
</script>
