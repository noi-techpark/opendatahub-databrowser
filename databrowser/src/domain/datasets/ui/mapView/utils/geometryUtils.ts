// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { BBox, Geometry, Position } from 'geojson';
import { GeometryVisibilityConfig } from '../config/geometryVisibility';

/**
 * Calculate bounding box for a geometry
 * Returns [minLng, minLat, maxLng, maxLat]
 */
export const calculateBBox = (geometry: Geometry): BBox => {
  const coordinates = extractAllCoordinates(geometry);

  if (coordinates.length === 0) {
    throw new Error('Geometry has no coordinates');
  }

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of coordinates) {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }

  return [minLng, minLat, maxLng, maxLat];
};

/**
 * Extract all coordinates from any geometry type
 */
const extractAllCoordinates = (geometry: Geometry): Position[] => {
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];

    case 'LineString':
    case 'MultiPoint':
      return geometry.coordinates;

    case 'Polygon':
      return geometry.coordinates.flat();

    case 'MultiLineString':
      return geometry.coordinates.flat();

    case 'MultiPolygon':
      return geometry.coordinates.flat(2);

    case 'GeometryCollection':
      return geometry.geometries.flatMap(extractAllCoordinates);

    default:
      return [];
  }
};

/**
 * Calculate centroid (center point) for a geometry
 * Uses simple average of all coordinates (not weighted by area)
 */
export const calculateCentroid = (geometry: Geometry): Position => {
  const coordinates = extractAllCoordinates(geometry);

  if (coordinates.length === 0) {
    throw new Error('Geometry has no coordinates');
  }

  // For Point, just return the point itself
  if (geometry.type === 'Point') {
    return geometry.coordinates;
  }

  // Calculate average of all coordinates
  let sumLng = 0;
  let sumLat = 0;

  for (const [lng, lat] of coordinates) {
    sumLng += lng;
    sumLat += lat;
  }

  return [sumLng / coordinates.length, sumLat / coordinates.length];
};

/**
 * Calculate the maximum span (width or height) of a geometry's bounding box
 * Returns the span in degrees
 */
export const calculateMaxSpan = (bbox: BBox): number => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const width = maxLng - minLng;
  const height = maxLat - minLat;
  return Math.max(width, height);
};

/**
 * Calculate minimum zoom level at which a geometry should be visible
 * Based on the geometry's size and the visibility configuration
 *
 * @param geometry - The geometry to calculate zoom for
 * @param config - Visibility configuration with zoom thresholds
 * @returns Minimum zoom level (integer)
 */
export const calculateMinZoom = (
  geometry: Geometry,
  config: GeometryVisibilityConfig
): number => {
  try {
    // For point geometries, use default min zoom
    if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
      return config.defaultMinZoom;
    }

    // Calculate bounding box and span
    const bbox = calculateBBox(geometry);
    const maxSpan = calculateMaxSpan(bbox);

    // Apply padding factor to make threshold slightly more conservative
    const adjustedSpan = maxSpan * (1 + config.bboxPaddingFactor);

    // Find appropriate zoom threshold
    for (const threshold of config.zoomThresholds) {
      if (adjustedSpan >= threshold.maxSpan) {
        return threshold.minZoom;
      }
    }

    // Fallback to default if no threshold matches
    return config.defaultMinZoom;
  } catch (error) {
    console.warn('Error calculating minZoom for geometry:', error);
    return config.defaultMinZoom;
  }
};

/**
 * Calculate maximum zoom level at which a polygon should be visible
 * Large polygons are hidden at high zoom to prevent covering the entire viewport
 * This allows smaller features inside to be visible when zoomed in
 *
 * @param geometry - The geometry to calculate zoom for
 * @param config - Visibility configuration
 * @returns Maximum zoom level (integer), or null if no max zoom
 */
export const calculateMaxZoom = (
  geometry: Geometry,
  config: GeometryVisibilityConfig
): number | null => {
  try {
    // Only apply maxZoom to polygons (not lines or points)
    if (
      geometry.type !== 'Polygon' &&
      geometry.type !== 'MultiPolygon'
    ) {
      return null; // No max zoom restriction
    }

    // Calculate bounding box and span
    const bbox = calculateBBox(geometry);
    const maxSpan = calculateMaxSpan(bbox);

    // Hide large polygons at high zoom to show features inside them
    // The larger the polygon, the earlier it should disappear
    if (maxSpan > 10) return 8;   // Very large (countries) - hide at zoom 8+
    if (maxSpan > 1) return 11;   // Large (regions) - hide at zoom 11+
    if (maxSpan > 0.5) return 13; // Medium-large (large cities) - hide at zoom 13+
    if (maxSpan > 0.1) return 15; // Medium (cities) - hide at zoom 15+
    if (maxSpan > 0.01) return 17; // Small (neighborhoods) - hide at zoom 17+

    // Very small polygons: no max zoom restriction
    return null;
  } catch (error) {
    console.warn('Error calculating maxZoom for geometry:', error, config);
    return null;
  }
};

/**
 * Check if a geometry should be visible at a given zoom level
 *
 * @param geometry - The geometry to check
 * @param currentZoom - Current map zoom level
 * @param config - Visibility configuration
 * @returns true if geometry should be visible
 */
export const isGeometryVisibleAtZoom = (
  geometry: Geometry,
  currentZoom: number,
  config: GeometryVisibilityConfig
): boolean => {
  // Always show above neverClusterAboveZoom
  if (currentZoom >= config.neverClusterAboveZoom) {
    return true;
  }

  // Never show below alwaysClusterBelowZoom
  if (currentZoom < config.alwaysClusterBelowZoom) {
    return false;
  }

  // Check against calculated min zoom
  const minZoom = calculateMinZoom(geometry, config);
  return currentZoom >= minZoom;
};

/**
 * Get a representative point for clustering
 * For Points: returns the point itself
 * For other geometries: returns the centroid
 */
export const getRepresentativePoint = (geometry: Geometry): Position => {
  if (geometry.type === 'Point') {
    return geometry.coordinates;
  }
  return calculateCentroid(geometry);
};

/**
 * Classify geometry by type for layer management
 */
export const classifyGeometryType = (
  geometry: Geometry
): 'point' | 'line' | 'polygon' => {
  switch (geometry.type) {
    case 'Point':
    case 'MultiPoint':
      return 'point';

    case 'LineString':
    case 'MultiLineString':
      return 'line';

    case 'Polygon':
    case 'MultiPolygon':
      return 'polygon';

    case 'GeometryCollection':
      // For GeometryCollection, classify by the first geometry
      if (geometry.geometries.length > 0) {
        return classifyGeometryType(geometry.geometries[0]);
      }
      return 'point'; // fallback

    default:
      return 'point'; // fallback
  }
};

/**
 * Get geometry info for debugging/logging
 */
export const getGeometryInfo = (geometry: Geometry): {
  type: string;
  coordinateCount: number;
  bbox: BBox;
  centroid: Position;
  maxSpan: number;
} => {
  const coordinates = extractAllCoordinates(geometry);
  const bbox = calculateBBox(geometry);
  const centroid = calculateCentroid(geometry);
  const maxSpan = calculateMaxSpan(bbox);

  return {
    type: geometry.type,
    coordinateCount: coordinates.length,
    bbox,
    centroid,
    maxSpan,
  };
};
