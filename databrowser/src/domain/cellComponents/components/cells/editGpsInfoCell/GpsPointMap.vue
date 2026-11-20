<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <UseFullscreen ref="fullscreenComponent" v-slot="{ toggle, isFullscreen }">
    <div
      class="relative size-full"
      :class="{
        'flex cursor-pointer items-center justify-center bg-black':
          !isFullscreen && preventInteraction && !lazy,
      }"
      @click="onContainerClick(isFullscreen)"
    >
      <IconExpanded
        v-if="preventInteraction && !lazy"
        class="absolute text-white transition-all group-hover:scale-125"
      />
      <div
        v-if="isFullscreen"
        class="absolute top-4 right-4 z-999 flex items-center gap-3"
      >
        <ButtonCustom
          v-if="!preventInteraction && editable"
          variant="ghost"
          size="xs"
          class="flex size-12 items-center justify-center bg-white p-2"
          @click="toggleEditMode()"
        >
          <IconPencil
            :class="
              enableSetMarker
                ? 'h-6 w-6 rounded-[3px] border-[1.5px] border-green-400 bg-hint-calm-secondary p-[2px]'
                : 'h-5 w-5 cursor-pointer text-green-400'
            "
          />
        </ButtonCustom>
        <ButtonCustom
          variant="ghost"
          size="xs"
          class="flex size-12 items-center justify-center bg-white p-2"
          @click="toggle()"
        >
          <IconClose class="cursor-pointer text-green-400" />
        </ButtonCustom>
      </div>
      <div
        class="pointer-events-none absolute right-2 bottom-6 z-999 rounded-md bg-black px-2 py-1 text-sm text-white opacity-0 transition-all"
        :class="{
          'opacity-100': isTooltipVisible,
        }"
      >
        {{ t('datasets.editView.map.clickOnTheMapToSetGPSPoint') }}
      </div>
      <template v-if="lazy && !isFullscreen">
        <button
          v-if="map.markers.length > 0"
          type="button"
          class="group/preview relative block w-full cursor-pointer overflow-hidden rounded-sm border border-gray-300 hover:border-green-400"
          :title="t('datasets.listView.showOnMap')"
        >
          <MapSnapshotPreview :position="map.markers[0]" :zoom="12" />
          <span
            class="absolute top-1 right-1 rounded-sm bg-white p-1 shadow-sm transition-transform group-hover/preview:scale-110"
          >
            <IconExpand class="size-3 text-green-400" />
          </span>
        </button>
        <span v-else class="text-sm text-gray-500">-</span>
      </template>
      <SimpleMap
        v-else
        :key="`map_${isFullscreen}`"
        :center="map.center"
        :markers="map.markers"
        :enable-set-marker="enableSetMarker"
        :zoom="12"
        :class="{
          'pointer-events-none opacity-50': !isFullscreen && preventInteraction,
        }"
        :hide-attribution="!isFullscreen"
        @map-click="onMapClick"
      />
    </div>
  </UseFullscreen>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import UseFullscreen from '../../../../../components/fullscreen/UseFullscreen.vue';
import MapSnapshotPreview from '../../../../../components/map/snapshot/MapSnapshotPreview.vue';
import { LatLngPosition } from '../../../../../components/map/types';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpand from '../../../../../components/svg/IconExpand.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import IconPencil from '../../../../../components/svg/IconPencil.vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';

// Dynamically import SimpleMap to improve code chunking
const SimpleMap = defineAsyncComponent(() =>
  import('../../../../../components/map/simpleMap/SimpleMap.vue').then(
    (exports) => exports.default
  )
);

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'mapClick', latLng: LatLngPosition): void;
  (e: 'enableSetMarker', enable: boolean): void;
}>();

const tooltipInterval = ref();
const isTooltipVisible = ref(false);

const fullscreenComponent = ref();
const enableSetMarker = ref(false);

const props = withDefaults(
  defineProps<{
    latitude?: string | number;
    longitude?: string | number;
    fallbackCenter?: LatLngPosition;
    editable?: boolean;
    preventInteraction?: boolean | string;
    fullscreenOnClick?: boolean | string;
    // Only create the map once it is opened in fullscreen. Use this where many
    // instances are rendered at once (e.g. table rows), because browsers limit
    // the number of simultaneous WebGL contexts.
    lazy?: boolean | string;
  }>(),
  {
    latitude: undefined,
    longitude: undefined,
    fallbackCenter: undefined,
    editable: false,
    preventInteraction: false,
    fullscreenOnClick: false,
    lazy: false,
  }
);

const { latitude, longitude, fallbackCenter } = toRefs(props);

// Table configs pass params as strings (e.g. 'true'), so normalize them
const preventInteraction = computed(() =>
  booleanOrStringToBoolean(props.preventInteraction, false)
);
const fullscreenOnClick = computed(() =>
  booleanOrStringToBoolean(props.fullscreenOnClick, false)
);
const lazy = computed(() => booleanOrStringToBoolean(props.lazy, false));

const map = computed<{
  center?: LatLngPosition;
  markers: LatLngPosition[];
}>(() => {
  if (longitude.value == null || latitude.value == null) {
    return {
      center: fallbackCenter.value,
      markers: [],
    };
  }

  const lng = Number(longitude.value);
  const lat = Number(latitude.value);

  return {
    center: { lat, lng },
    markers: [{ lat, lng }],
  };
});

watch(enableSetMarker, (newVal) => emit('enableSetMarker', newVal));

const onMapClick = (latLng: LatLngPosition) => {
  if (!enableSetMarker.value) return;

  emit('mapClick', latLng);
};

const toggleFullscreen = () => {
  fullscreenComponent.value.toggleFullscreen();
};

const toggleEditMode = () => {
  enableSetMarker.value = !enableSetMarker.value;

  if (enableSetMarker.value) {
    showTooltip();
    tooltipInterval.value = setTimeout(() => {
      hideTooltip();
    }, 5000);
  } else {
    hideTooltip();
  }
};

const showTooltip = () => {
  isTooltipVisible.value = true;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
  clearInterval(tooltipInterval.value);
};

const onContainerClick = (isFullscreen: boolean) => {
  if (isFullscreen) {
    return;
  }

  // In lazy mode the preview is the only way to reach the map
  if (lazy.value) {
    if (map.value.markers.length > 0) {
      toggleFullscreen();
    }
    return;
  }

  if (!fullscreenOnClick.value) {
    return;
  }

  toggleFullscreen();
};

defineExpose({ toggleEditMode, toggleFullscreen });
</script>
