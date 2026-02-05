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

      <!-- Geometry type selector (visible when drawing, in or out of fullscreen) -->
      <div
        v-if="enableSetMarker"
        class="absolute left-4 top-4 z-[999] flex items-center gap-2 rounded bg-white px-3 py-2 shadow-lg"
      >
        <span class="text-sm font-semibold">Shape:</span>
        <button
          v-for="type in geometryTypes"
          :key="type.value"
          class="rounded px-3 py-1 text-sm transition-colors"
          :class="
            selectedGeometryType === type.value
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="onGeometryTypeChange(type.value)"
        >
          {{ type.label }}
        </button>
      </div>

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
        {{ t('datasets.editView.map.clickOnTheMapToDrawGeometry') }}
      </div>
      <div ref="mapContainerRef" class="size-full">
        <EditableWktMap
          ref="editableWktMapRef"
          :wkt="wkt"
          :center="mapConfig.center"
          :zoom="mapConfig.zoom"
          :drawing-geometry-type="selectedGeometryType"
          :editable="editable"
          :class="{
            'pointer-events-none opacity-50': !isFullscreen && preventInteraction,
          }"
          :hide-attribution="!isFullscreen"
          @update:wkt="onWktUpdate"
          @enable-set-marker="onEnableSetMarker"
        />
      </div>
    </div>
  </UseFullscreen>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import UseFullscreen from '../../../../../components/fullscreen/UseFullscreen.vue';
import { LatLngPosition } from '../../../../../components/map/types';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import IconPencil from '../../../../../components/svg/IconPencil.vue';
import type { GeometryType } from '../../../../../components/map/wktMap/EditableWktMap.vue';
import { parseWKT } from '../../../../../components/map/utils/wktParser';
import { LngLatBounds } from 'maplibre-gl';

// Dynamically import EditableWktMap to improve code chunking
const EditableWktMap = defineAsyncComponent(() =>
  import('../../../../../components/map/wktMap/EditableWktMap.vue').then(
    (exports) => exports.default
  )
);

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'enableSetMarker', enable: boolean): void;
  (e: 'update:wkt', wkt: string): void;
}>();

const tooltipInterval = ref();
const isTooltipVisible = ref(false);

const fullscreenComponent = ref();
const editableWktMapRef = ref();
const mapContainerRef = ref<HTMLElement>();
const enableSetMarker = ref(false);
const selectedGeometryType = ref<GeometryType>('Polygon');
const containerSize = ref({ width: 600, height: 400 }); // Default size

const geometryTypes = [
  { label: 'Point', value: 'Point' as GeometryType },
  { label: 'Line', value: 'LineString' as GeometryType },
  { label: 'Polygon', value: 'Polygon' as GeometryType },
];

const props = withDefaults(
  defineProps<{
    wkt?: string;
    fallbackCenter?: LatLngPosition;
    editable?: boolean;
    preventInteraction?: boolean;
    fullscreenOnClick?: boolean;
  }>(),
  {
    wkt: undefined,
    fallbackCenter: undefined,
    editable: false,
    preventInteraction: false,
    fullscreenOnClick: false,
  }
);

// Calculate appropriate zoom level based on bounds and container size
const calculateZoomFromBounds = (bounds: LngLatBounds, width: number, height: number): number => {
  // Guard against invalid dimensions
  if (!width || !height || width < 0 || height < 0) {
    // Fallback to span-based calculation if container not properly sized
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latSpan = Math.abs(ne.lat - sw.lat);
    const lngSpan = Math.abs(ne.lng - sw.lng);
    const maxSpan = Math.max(latSpan, lngSpan);

    // Return reasonable zoom based on span
    if (maxSpan >= 1) return 9;
    if (maxSpan >= 0.1) return 11;
    if (maxSpan >= 0.01) return 13;
    return 15;
  }

  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  // Use proportional padding: 20% of container size, with min/max bounds
  const paddingPercent = 0.5;
  const paddingWidth = Math.min(Math.max(width * paddingPercent, 20), 100);
  const paddingHeight = Math.min(Math.max(height * paddingPercent, 20), 100);

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const latRad = (lat: number) => {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  };

  const latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;
  const lngDiff = ne.lng - sw.lng;
  const lngFraction = ((lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360);

  const latZoom = Math.floor(Math.log((height - paddingHeight) / WORLD_DIM.height / latFraction) / Math.LN2);
  const lngZoom = Math.floor(Math.log((width - paddingWidth) / WORLD_DIM.width / lngFraction) / Math.LN2);
  return Math.min(latZoom, lngZoom, ZOOM_MAX);
};

// Compute map center and zoom from WKT
const mapConfig = computed<{
  center?: LatLngPosition;
  zoom?: number;
}>(() => {
  if (!props.wkt) {
    return {
      center: props.fallbackCenter,
      zoom: 12,
    };
  }

  try {
    const geometry = parseWKT(props.wkt);
    const bounds = new LngLatBounds();

    const addCoordsToBounds = (coords: unknown): void => {
      if (Array.isArray(coords)) {
        if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
          bounds.extend(coords as [number, number]);
        } else {
          coords.forEach((coord) => addCoordsToBounds(coord));
        }
      }
    };

    if ('coordinates' in geometry) {
      addCoordsToBounds(geometry.coordinates);
    }

    if (!bounds.isEmpty()) {
      const center = bounds.getCenter();
      const zoom = geometry.type === 'Point'
        ? 12
        : calculateZoomFromBounds(bounds, containerSize.value.width, containerSize.value.height);

      return {
        center: { lat: center.lat, lng: center.lng },
        zoom,
      };
    }
  } catch (error) {
    console.error('Error parsing WKT for map config:', error);
  }

  return {
    center: props.fallbackCenter,
    zoom: 12,
  };
});

watch(enableSetMarker, (newVal) => emit('enableSetMarker', newVal));

// Detect geometry type from WKT when it changes
watch(
  () => props.wkt,
  (newWkt) => {
    if (!newWkt || enableSetMarker.value) return; // Don't change type while drawing

    try {
      const trimmed = newWkt.trim().toUpperCase();
      if (trimmed.startsWith('POINT')) {
        selectedGeometryType.value = 'Point';
      } else if (trimmed.startsWith('LINESTRING') || trimmed.startsWith('MULTILINESTRING')) {
        selectedGeometryType.value = 'LineString';
      } else if (trimmed.startsWith('POLYGON') || trimmed.startsWith('MULTIPOLYGON')) {
        selectedGeometryType.value = 'Polygon';
      }
    } catch (error) {
      // Ignore parsing errors
      console.log("failed to parse wkt", newWkt.trim().toUpperCase(), error)
    }
  },
  { immediate: true }
);

const onWktUpdate = (wkt: string) => {
  emit('update:wkt', wkt);
};

const onEnableSetMarker = (value: boolean) => {
  enableSetMarker.value = value;
};

const onGeometryTypeChange = (type: GeometryType) => {
  selectedGeometryType.value = type;
  // The watcher in EditableWktMap will automatically restart drawing with the new type
};

const toggleFullscreen = () => {
  fullscreenComponent.value.toggleFullscreen();
};

const toggleEditMode = () => {
  // Call the EditableWktMap's toggleEditMode method
  editableWktMapRef.value?.toggleEditMode();

  // Show/hide tooltip based on current state
  // Note: enableSetMarker will be updated via the @enable-set-marker event
  if (!enableSetMarker.value) {
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

// Track container size for accurate zoom calculation
let resizeObserver: ResizeObserver | null = null;

const updateContainerSize = () => {
  if (mapContainerRef.value) {
    const rect = mapContainerRef.value.getBoundingClientRect();
    const newWidth = rect.width || 600;
    const newHeight = rect.height || 400;

    // Only update if we got valid dimensions
    if (newWidth > 0 && newHeight > 0) {
      containerSize.value = { width: newWidth, height: newHeight };
    }
  }
};

onMounted(async () => {
  // Wait for DOM to be fully rendered
  await nextTick();

  if (mapContainerRef.value) {
    // Use ResizeObserver which fires when element gets real size
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Update size when we get valid dimensions
        if (width > 0 && height > 0) {
          containerSize.value = { width, height };
        }
      }
    });

    resizeObserver.observe(mapContainerRef.value);

    // Measure after DOM is ready
    updateContainerSize();

    // Sometimes the size isn't available immediately even after nextTick
    // Try again after a short delay
    setTimeout(updateContainerSize, 50);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

defineExpose({ toggleEditMode, toggleFullscreen });
</script>
