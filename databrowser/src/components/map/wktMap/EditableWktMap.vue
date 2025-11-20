<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseMap
    :init-map="editableWktMapInit"
    :hide-attribution="hideAttribution"
    @map-ready="mapReady"
  />
</template>

<script lang="ts" setup>
import { IControl, Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapboxDraw from 'maplibre-gl-draw';
import 'maplibre-gl-draw/dist/mapbox-gl-draw.css';
import { onUnmounted, ref, watch } from 'vue';
import BaseMap from '../BaseMap.vue';
import { handleMapAttribution, initMap } from '../utils';
import { parseWKT, geoJSONToWKT } from '../utils/wktParser';
import { Feature, Geometry } from 'geojson';

export type GeometryType = 'Point' | 'LineString' | 'Polygon';

const emit = defineEmits<{
  (e: 'update:wkt', wkt: string): void;
  (e: 'enableSetMarker', enable: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    wkt?: string;
    editable?: boolean;
    drawingGeometryType?: GeometryType;
    center?: { lat: number; lng: number };
    zoom?: number;
    hideAttribution?: boolean;
  }>(),
  {
    wkt: undefined,
    editable: true,
    drawingGeometryType: 'Polygon',
    center: undefined,
    zoom: undefined,
    hideAttribution: false,
  }
);

const map = ref<Map>();
const draw = ref<MapboxDraw>();
const displayMarker = ref<Marker | null>(null);
const isDrawing = ref(false);

const editableWktMapInit = (mapId: string) =>
  initMap(mapId, {
    center: props.center,
    zoom: props.zoom,
  });

/**
 * Initialize MapLibre GL Draw (hidden by default)
 */
const initializeDraw = (mapInstance: Map) => {
  draw.value = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      point: false,
      line_string: false,
      polygon: false,
      trash: false, // Hide the trash button
    },
    styles: [
      // Polygon fill
      {
        id: 'gl-draw-polygon-fill',
        type: 'fill',
        filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        paint: {
          'fill-color': '#476929',
          'fill-outline-color': '#476929',
          'fill-opacity': 0.3,
        },
      },
      // Polygon outline
      {
        id: 'gl-draw-polygon-stroke-active',
        type: 'line',
        filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        paint: {
          'line-color': '#476929',
          'line-width': 2,
        },
      },
      // Line
      {
        id: 'gl-draw-line',
        type: 'line',
        filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
        paint: {
          'line-color': '#476929',
          'line-width': 3,
        },
      },
      // Point - using MapLibre blue to match default marker
      {
        id: 'gl-draw-point',
        type: 'circle',
        filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        paint: {
          'circle-radius': 8,
          'circle-color': '#3FB1CE', // MapLibre default blue
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      },
      // Vertex points
      {
        id: 'gl-draw-polygon-and-line-vertex-active',
        type: 'circle',
        filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#476929',
        },
      },
    ],
  });

  mapInstance.addControl(draw.value as unknown as IControl);

  // Listen to draw events
  mapInstance.on('draw.create', handleDrawCreate); // Auto-exit on create
  mapInstance.on('draw.update', handleDrawUpdate);
  mapInstance.on('draw.delete', handleDrawUpdate);
};

/**
 * Handle draw create event - auto-exit drawing mode when shape is complete
 */
const handleDrawCreate = () => {
  if (!draw.value) return;

  const features = draw.value.getAll();

  if (features.features.length === 0) {
    emit('update:wkt', '');
    return;
  }

  // Convert the first feature to WKT
  const feature = features.features[0];
  const wkt = geoJSONToWKT(feature.geometry as Geometry);

  // Clear draw control immediately to remove the drawing style
  draw.value.deleteAll();

  // Emit WKT update
  emit('update:wkt', wkt);

  // Automatically exit drawing mode to show the shape with proper display styles
  // This ensures points show as markers, polygons/lines show styled correctly
  setTimeout(() => {
    if (!draw.value) return;
    draw.value.changeMode('simple_select');
    isDrawing.value = false;
    emit('enableSetMarker', false);
  }, 50);

  // Wait a bit longer for props to update, then display the geometry
  setTimeout(() => {
    if (props.wkt) {
      displayWktGeometry(props.wkt);
    }
  }, 150);
};

/**
 * Handle draw update/delete events
 */
const handleDrawUpdate = () => {
  if (!draw.value) return;

  const features = draw.value.getAll();

  if (features.features.length === 0) {
    emit('update:wkt', '');
    return;
  }

  // Convert the first feature to WKT
  const feature = features.features[0];
  const wkt = geoJSONToWKT(feature.geometry as Geometry);
  emit('update:wkt', wkt);
};

/**
 * Display existing WKT geometry (not in draw mode)
 */
const displayWktGeometry = (wktString: string) => {
    if (!map.value || !wktString) return;

  try {
    const geometry = parseWKT(wktString);

    // Remove display marker if exists
    if (displayMarker.value) {
      displayMarker.value.remove();
      displayMarker.value = null;
    }

    // For Point geometries, show a marker (using default MapLibre marker like SimpleMap)
    if (geometry.type === 'Point') {
      const coords = geometry.coordinates as [number, number];

      // Clear any existing geometries from draw control (e.g., old polygons/lines)
      if (draw.value) {
        draw.value.deleteAll();
      }

      // Use default marker (same as SimpleMap)
      displayMarker.value = new Marker()
        .setLngLat([coords[0], coords[1]])
        .addTo(map.value);

      // Don't move map - it's already positioned by initMap with center/zoom from wrapper
    } else {
      // For other geometries, add to draw in static mode
      if (draw.value) {
        draw.value.deleteAll();
        const feature: Feature = {
          type: 'Feature',
          geometry,
          properties: {},
        };
        draw.value.add(feature);
        draw.value.changeMode('simple_select');

        // Map is already initialized with correct center/zoom from wrapper
      }
    }
  } catch (error) {
    console.error('Error displaying WKT:', error);
  }
};

/**
 * Enable drawing mode based on geometry type from prop
 */
const enableDrawing = () => {
  if (!draw.value) return;

  // Remove display marker if exists
  if (displayMarker.value) {
    displayMarker.value.remove();
    displayMarker.value = null;
  }

  // Clear ALL existing features from draw control
  // This ensures old polygons/lines/points are removed
  draw.value.deleteAll();

  isDrawing.value = true;
  emit('enableSetMarker', true);

  // Small delay to ensure deleteAll completes before entering draw mode
  setTimeout(() => {
    if (!draw.value) return;

    switch (props.drawingGeometryType) {
      case 'Point':
        draw.value.changeMode('draw_point');
        break;
      case 'LineString':
        draw.value.changeMode('draw_line_string');
        break;
      case 'Polygon':
        draw.value.changeMode('draw_polygon');
        break;
    }
  }, 10);
};

/**
 * Disable drawing mode
 */
const disableDrawing = () => {
  if (!draw.value) return;

  draw.value.changeMode('simple_select');
  isDrawing.value = false;
  emit('enableSetMarker', false);

  // Redisplay the existing WKT
  if (props.wkt) {
    displayWktGeometry(props.wkt);
  }
};

/**
 * Toggle edit mode (called from parent via ref or direct call)
 */
const toggleEditMode = () => {
  if (isDrawing.value) {
    disableDrawing();
  } else {
    enableDrawing();
  }
};

const mapReady = (readyMap: Map) => {
  map.value = readyMap;

  initializeDraw(readyMap);

  // Display existing WKT if provided (don't enter draw mode)
  // Map is already positioned by initMap with center/zoom from wrapper
  if (props.wkt) {
    displayWktGeometry(props.wkt);
  }
};

// Watch for WKT changes from outside (only if not currently drawing)
watch(
  () => props.wkt,
  (newWkt) => {
    if (!map.value || isDrawing.value) return;

    if (newWkt) {
      displayWktGeometry(newWkt);
    } else {
      if (draw.value) {
        draw.value.deleteAll();
      }
      if (displayMarker.value) {
        displayMarker.value.remove();
        displayMarker.value = null;
      }
    }
  }
);

// Watch for geometry type changes while drawing
watch(
  () => props.drawingGeometryType,
  () => {
    if (isDrawing.value) {
      enableDrawing();
    }
  }
);

onUnmounted(() => {
  if (map.value && draw.value) {
    map.value.removeControl(draw.value as unknown as IControl);
  }
  if (displayMarker.value) {
    displayMarker.value.remove();
  }
});

// Show / hide attribution
handleMapAttribution(map, props.hideAttribution);

// Expose methods
defineExpose({
  toggleEditMode,
  isDrawing: () => isDrawing.value,
});
</script>
