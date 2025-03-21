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
          !isFullscreen && preventInteraction,
      }"
      @click="onContainerClick(isFullscreen)"
    >
      <IconExpanded
        v-if="preventInteraction"
        class="absolute text-white transition-all group-hover:scale-125"
      />
      <div
        v-if="isFullscreen"
        class="absolute right-4 top-4 z-[999] flex items-center gap-3"
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
        class="pointer-events-none absolute bottom-6 right-2 z-[999] rounded-md bg-black px-2 py-1 text-sm text-white opacity-0 transition-all"
        :class="{
          'opacity-100': isTooltipVisible,
        }"
      >
        {{ t('datasets.editView.map.clickOnTheMapToSetGPSPoint') }}
      </div>
      <SimpleMap
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
import { LatLngPosition } from '../../../../../components/map/types';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import IconPencil from '../../../../../components/svg/IconPencil.vue';

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
    preventInteraction?: boolean;
    fullscreenOnClick?: boolean;
  }>(),
  {
    latitude: undefined,
    longitude: undefined,
    fallbackCenter: undefined,
    editable: false,
    preventInteraction: false,
    fullscreenOnClick: false,
  }
);

const { latitude, longitude, fallbackCenter } = toRefs(props);

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
  if (isFullscreen || !props.fullscreenOnClick) {
    return;
  }

  toggleFullscreen();
};

defineExpose({ toggleEditMode, toggleFullscreen });
</script>
