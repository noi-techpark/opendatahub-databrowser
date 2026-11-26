<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Table cell showing a geometry as a static map image. The image is rendered
  by the shared snapshot map, so the cell doesn't need its own WebGL context
  and can be shown in every table row. Clicking it opens the interactive map
  in fullscreen.

  The geometry is either the default entry of a content API "Geo" object, or
  a point given by latitude and longitude (e.g. timeseries coordinates).
-->

<template>
  <UseFullscreen v-if="wkt" v-slot="{ toggle, isFullscreen }" class="w-36">
    <div v-if="isFullscreen" class="relative size-full">
      <GeoDataMap class="size-full" :wkt="wkt" />
      <ButtonCustom
        variant="ghost"
        size="xs"
        class="absolute top-4 right-4 z-999 flex size-12 items-center justify-center bg-white p-2"
        @click="toggle()"
      >
        <IconClose class="cursor-pointer text-green-400" />
      </ButtonCustom>
    </div>
    <button
      v-else
      ref="previewRef"
      type="button"
      class="group/preview relative block h-24 w-36 cursor-pointer overflow-hidden rounded-sm border border-gray-300 bg-gray-100 hover:border-green-400"
      :title="t('datasets.listView.showOnMap')"
      @click.stop="toggle()"
      @dblclick.stop
    >
      <img
        v-if="state === 'ready'"
        :src="src"
        alt=""
        class="size-full object-cover"
        :width="snapshotWidth"
        :height="snapshotHeight"
      />
      <span
        v-else-if="state === 'error'"
        class="flex size-full items-center justify-center gap-1 px-1 text-xs"
      >
        <IconLocationOn class="size-4 shrink-0 text-green-400" />
        {{ fallbackText }}
      </span>
      <span v-else class="block size-full animate-pulse bg-gray-200"></span>
      <span
        class="absolute top-1 right-1 rounded-sm bg-white p-1 shadow-sm transition-transform group-hover/preview:scale-110"
      >
        <IconExpand class="size-3 text-green-400" />
      </span>
    </button>
  </UseFullscreen>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import UseFullscreen from '../../../../../components/fullscreen/UseFullscreen.vue';
import {
  getMapSnapshot,
  snapshotHeight,
  snapshotWidth,
} from '../../../../../components/map/snapshot/mapSnapshot';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpand from '../../../../../components/svg/IconExpand.vue';
import IconLocationOn from '../../../../../components/svg/IconLocationOn.vue';
import type { GeoData } from '../editGeoDataCell/types';

// Dynamically import GeoDataMap, it is only needed in fullscreen
const GeoDataMap = defineAsyncComponent(() =>
  import('../editGeoDataCell/GeoDataMap.vue').then((exports) => exports.default)
);

const { t } = useI18n();

const props = defineProps<{
  geoData?: GeoData | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
}>();

const toCoordinate = (value?: string | number | null) => {
  if (value == null || value === '') {
    return undefined;
  }
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
};

const pointWkt = (
  latitude?: string | number | null,
  longitude?: string | number | null
) => {
  const lat = toCoordinate(latitude);
  const lng = toCoordinate(longitude);
  return lat != null && lng != null ? `POINT (${lng} ${lat})` : undefined;
};

const wkt = computed(() => {
  // Explicit coordinates take precedence over Geo data
  const fromCoordinates = pointWkt(props.latitude, props.longitude);
  if (fromCoordinates != null) {
    return fromCoordinates;
  }

  if (props.geoData == null) {
    return undefined;
  }

  const defaultEntry = Object.values(props.geoData).find(
    (entry) => entry?.Default === true
  );
  if (defaultEntry == null) {
    return undefined;
  }

  return (
    defaultEntry.Geometry ||
    pointWkt(defaultEntry.Latitude, defaultEntry.Longitude)
  );
});

// Shown when the snapshot can't be rendered
const fallbackText = computed(() => {
  const lat = toCoordinate(props.latitude);
  const lng = toCoordinate(props.longitude);
  if (lat != null && lng != null) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  return wkt.value?.trim().split(/[\s(]/)[0] ?? '-';
});

const previewRef = ref<HTMLElement>();
const isVisible = ref(false);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const src = ref<string>();

// Only request snapshots for cells that are (or were) on screen
const { stop } = useIntersectionObserver(previewRef, ([entry]) => {
  if (entry?.isIntersecting) {
    isVisible.value = true;
    stop();
  }
});

let requestId = 0;
watch(
  [isVisible, wkt],
  async () => {
    if (!isVisible.value || wkt.value == null) {
      return;
    }

    const currentRequest = ++requestId;
    state.value = 'loading';
    try {
      const snapshot = await getMapSnapshot(wkt.value);
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
</script>
