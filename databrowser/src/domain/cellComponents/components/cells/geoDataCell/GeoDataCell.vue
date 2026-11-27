<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Table cell showing a geometry as a static map image. The image is rendered
  by the shared snapshot map, so the cell doesn't need its own WebGL context
  and can be shown in every table row. Clicking it opens the interactive map
  in a dialog.

  The geometry is either the default entry of a content API "Geo" object, or
  a point given by latitude and longitude (e.g. timeseries coordinates).
-->

<template>
  <div v-if="wkt" class="w-36">
    <button
      ref="previewRef"
      type="button"
      class="group/preview relative block h-24 w-36 cursor-pointer overflow-hidden rounded-sm border border-gray-300 bg-gray-100 hover:border-green-400"
      :title="t('datasets.listView.showOnMap')"
      @click.stop="isMapOpen = true"
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

    <!-- The interactive map is only created when the dialog is opened -->
    <DialogFullScreen
      v-if="isMapOpen"
      :is-open="isMapOpen"
      inset
      @close="isMapOpen = false"
    >
      <div class="flex items-center gap-2 border-b border-gray-300 p-2 pl-4">
        <IconLocationOn class="size-5 shrink-0 text-green-400" />
        <span class="font-semibold">{{ t('datasets.listView.map') }}</span>
        <span class="truncate font-mono text-sm text-gray-600">
          {{ headerText }}
        </span>
        <ButtonCustom
          variant="ghost"
          size="xs"
          class="ml-auto flex size-11 shrink-0 items-center justify-center"
          :title="t('datasets.listView.closeMap')"
          @click="isMapOpen = false"
        >
          <IconClose class="text-green-400" />
        </ButtonCustom>
      </div>
      <div class="min-h-0 flex-1">
        <GeoDataMap class="size-full" :wkt="wkt" />
      </div>
    </DialogFullScreen>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import DialogFullScreen from '../../../../../components/dialog/DialogFullScreen.vue';
import {
  getMapSnapshot,
  snapshotHeight,
  snapshotWidth,
} from '../../../../../components/map/snapshot/mapSnapshot';
import { parseWKT } from '../../../../../components/map/utils/wktParser';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpand from '../../../../../components/svg/IconExpand.vue';
import IconLocationOn from '../../../../../components/svg/IconLocationOn.vue';
import type { GeoData } from '../editGeoDataCell/types';

// Dynamically import GeoDataMap, it is only needed in the dialog
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

const isMapOpen = ref(false);

// Shown when the snapshot can't be rendered
const fallbackText = computed(() => {
  const lat = toCoordinate(props.latitude);
  const lng = toCoordinate(props.longitude);
  if (lat != null && lng != null) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
  return wkt.value?.trim().split(/[\s(]/)[0] ?? '-';
});

// Coordinates for points, otherwise the geometry type
const headerText = computed(() => {
  if (wkt.value == null) {
    return '';
  }
  try {
    const geometry = parseWKT(wkt.value);
    if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    }
    return geometry.type;
  } catch {
    return '';
  }
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
