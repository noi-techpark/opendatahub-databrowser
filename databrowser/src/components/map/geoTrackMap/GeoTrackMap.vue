<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseMap :init-map="geoTrackMapInit" @map-ready="mapReady" />
</template>

<script lang="ts" setup>
import { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { onUnmounted, ref, watch } from 'vue';
import BaseMap from '../BaseMap.vue';
import { handleMapAttribution, initMap, getGeoJsonBounds } from '../utils';
import { randomId } from '../../utils/random';

/**
 * Validate and format coordinate pair.
 */
const validateCoordinate = (lat: string | null, lon: string | null): number[] | null => {
  if (!lat || !lon) return null;
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (!isNaN(latitude) && !isNaN(longitude) && 
      latitude >= -90 && latitude <= 90 && 
      longitude >= -180 && longitude <= 180) {
    return [longitude, latitude];
  }
  return null;
};
/**
 * Parse GPX data to extract coordinates.
 */
const parseGpxToCoordinates = (gpxData: string): number[][] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxData, 'application/xml');
    
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('GPX parsing error:', parserError.textContent);
      return [];
    }
    
    const coordinates: number[][] = [];
    
    // Get all track points (trkpt elements)
    const trackPoints = xmlDoc.querySelectorAll('trkpt');
    trackPoints.forEach((point) => {
      const coord = validateCoordinate(
        point.getAttribute('lat'),
        point.getAttribute('lon')
      );
      if (coord) coordinates.push(coord);
    });
    
    // Get all route points (rtept elements)
    const routePoints = xmlDoc.querySelectorAll('rtept');
    routePoints.forEach((point) => {
      const coord = validateCoordinate(
        point.getAttribute('lat'),
        point.getAttribute('lon')
      );
      if (coord) coordinates.push(coord);
    });
    
    // If no track or route points found, try waypoints (wpt elements)
    if (coordinates.length === 0) {
      const waypoints = xmlDoc.querySelectorAll('wpt');
      waypoints.forEach((point) => {
        const coord = validateCoordinate(
          point.getAttribute('lat'),
          point.getAttribute('lon')
        );
        if (coord) coordinates.push(coord);
      });
    }
    
    return coordinates;
  } catch (error) {
    console.error('Error parsing GPX data:', error);
    return [];
  }
};

/**
 * Parse KML data to extract coordinates.
 */
const parseKmlToCoordinates = (kmlData: string): number[][] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlData, 'application/xml');
    
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('KML parsing error:', parserError.textContent);
      return [];
    }
    
    const coordinates: number[][] = [];
    
    // Get coordinates from various KML elements
    const coordElements = xmlDoc.querySelectorAll('coordinates');
    coordElements.forEach((coordElement) => {
      const coordText = coordElement.textContent?.trim();
      if (coordText) {
        // KML coordinates format: longitude,latitude,altitude longitude,latitude,altitude
        const coordPairs = coordText.split(/\s+/).filter(pair => pair.trim().length > 0);
        
        coordPairs.forEach((pair) => {
          const parts = pair.split(',');
          if (parts.length >= 2) {
            const coord = validateCoordinate(parts[1], parts[0]); // KML is lon,lat
            if (coord) coordinates.push(coord);
          }
        });
      }
    });
        
    return coordinates;
  } catch (error) {
    console.error('Error parsing KML data:', error);
    return [];
  }
};

/**
 * Parse track data in various formats (GeoJSON, GPX, KML).
 */
const parseTrackData = (trackData: string): number[][] => {
  if (!trackData || typeof trackData !== 'string') {
    return [];
  }
  
  const trimmedData = trackData.trim();
  
  // Try to parse as JSON first
  try {
    const jsonData = JSON.parse(trimmedData);
    
    // Handle API response format with Geometry property
    if (jsonData.Geometry && jsonData.Geometry.coordinates) {
      const geometry = jsonData.Geometry;
      
      if (geometry.type === 'LineString' && Array.isArray(geometry.coordinates)) {
        return geometry.coordinates;
      }
      
      if (geometry.type === 'MultiLineString' && Array.isArray(geometry.coordinates)) {
        return geometry.coordinates.flatMap((line: number[][]) => line);
      }
    }
    
    // Handle direct GeoJSON LineString
    if (jsonData.type === 'LineString' && jsonData.coordinates) {
      return jsonData.coordinates;
    }
    
    // Handle GeoJSON Feature with LineString geometry
    if (jsonData.type === 'Feature' && 
        jsonData.geometry?.type === 'LineString' && 
        jsonData.geometry.coordinates) {
      return jsonData.geometry.coordinates;
    }
    
    // Handle MultiLineString
    if (jsonData.type === 'MultiLineString' && jsonData.coordinates) {
      return jsonData.coordinates.flatMap((line: number[][]) => line);
    }
    
    if (jsonData.type === 'Feature' && 
        jsonData.geometry?.type === 'MultiLineString' && 
        jsonData.geometry.coordinates) {
      return jsonData.geometry.coordinates.flatMap((line: number[][]) => line);
    }
  } catch {
    // Not valid JSON, continue with XML formats
  }
  
  // Check if it's GPX
  if (trimmedData.includes('<gpx') || trimmedData.includes('<trkpt')) {
    return parseGpxToCoordinates(trimmedData);
  }
  
  // Check if it's KML
  if (trimmedData.includes('<kml') || trimmedData.includes('<LineString')) {
    return parseKmlToCoordinates(trimmedData);
  }
  
  return [];
};

const props = withDefaults(
  defineProps<{
    trackData: string | null;
    hideAttribution?: boolean;
  }>(),
  {
    trackData: null,
    hideAttribution: false,
  }
);

const map = ref<Map>();
const sourceId = `geo-track-source-${randomId()}`;
const layerId = `geo-track-layer-${randomId()}`;

const geoTrackMapInit = (mapId: string) => initMap(mapId);

const addTrackToMap = (mapInstance: Map, coordinates: number[][]) => {
  if (mapInstance.getSource(sourceId) || !coordinates.length) {
    return;
  }

  // Validate coordinates structure
  const validCoordinates = coordinates.filter(coord => 
    Array.isArray(coord) && 
    coord.length >= 2 && 
    typeof coord[0] === 'number' && 
    typeof coord[1] === 'number'
  );

  if (validCoordinates.length < 2) {
    console.warn('Not enough valid coordinates to draw a line');
    return;
  }

  // Create GeoJSON LineString from coordinates
  const geoJsonData = {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: validCoordinates,
    },
    properties: {},
  };

  mapInstance.addSource(sourceId, {
    type: 'geojson',
    data: geoJsonData,
  });

  mapInstance.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#476929',
      'line-width': 3,
    },
  });

  // Fit map to track bounds
  const bounds = getGeoJsonBounds({
    type: 'LineString',
    coordinates: validCoordinates
  });
  if (bounds) {
    mapInstance.fitBounds(bounds, {
      padding: 15,
      duration: 0,
    });
  }
};

const updateTrackOnMap = (mapInstance: Map, coordinates: number[][]) => {
  const source = mapInstance.getSource(sourceId) as maplibregl.GeoJSONSource;
  
  if (source && coordinates.length > 0) {
    const geoJsonData = {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: coordinates,
      },
      properties: {},
    };
    
    source.setData(geoJsonData);
    
    // Fit map to new track bounds
    const bounds = getGeoJsonBounds({
      type: 'LineString',
      coordinates: coordinates
    });
    if (bounds) {
      mapInstance.fitBounds(bounds, { padding: 15 });
    }
  } else if (coordinates.length > 0) {
    addTrackToMap(mapInstance, coordinates);
  }
};

const mapReady = (readyMap: Map) => {
  map.value = readyMap;
  
  if (props.trackData) {
    const coordinates = parseTrackData(props.trackData);
    if (coordinates.length > 0) {
      addTrackToMap(readyMap, coordinates);
    }
  }
};

// Watch for track data changes to update the map
watch(
  () => props.trackData,
  (newTrackData) => {
    const mapInstance = map.value;
    if (!mapInstance || !mapInstance.loaded()) return;

    if (newTrackData) {
      const coordinates = parseTrackData(newTrackData);
      updateTrackOnMap(mapInstance, coordinates);
    } else {
      // Remove existing track if no data
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
      if (mapInstance.getSource(sourceId)) {
        mapInstance.removeSource(sourceId);
      }
    }
  }
);

onUnmounted(() => {
  if (map.value && map.value.getStyle()) {
    if (map.value.getLayer(layerId)) {
      map.value.removeLayer(layerId);
    }
    if (map.value.getSource(sourceId)) {
      map.value.removeSource(sourceId);
    }
  }
});

// Show / hide attribution
handleMapAttribution(map, props.hideAttribution);
</script>
