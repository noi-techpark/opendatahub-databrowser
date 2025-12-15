// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Configuration for adaptive geometry visibility based on size
 *
 * This module defines how geometries of different sizes should be displayed
 * at different zoom levels. Larger geometries (e.g., regions) appear at lower
 * zoom levels, while smaller geometries (e.g., points) appear at higher zoom.
 */

export interface ZoomThreshold {
  /**
   * Maximum span (in degrees) for this threshold
   * Span = max(longitude span, latitude span) of geometry's bounding box
   */
  maxSpan: number;

  /**
   * Minimum zoom level at which geometries of this size should be visible
   * Lower zoom = more zoomed out (e.g., 6 = continent level)
   * Higher zoom = more zoomed in (e.g., 16 = street level)
   */
  minZoom: number;
}

export interface GeometryVisibilityConfig {
  /**
   * Zoom thresholds based on geometry size
   * Sorted from largest to smallest maxSpan
   */
  zoomThresholds: ZoomThreshold[];

  /**
   * Always show clusters below this zoom level
   * Above this zoom, actual geometries start to appear based on their size
   */
  alwaysClusterBelowZoom: number;

  /**
   * Never cluster above this zoom level
   * At this zoom and higher, always show individual geometries
   */
  neverClusterAboveZoom: number;

  /**
   * Default minimum zoom if calculation fails or for point geometries
   */
  defaultMinZoom: number;

  /**
   * Padding factor for bbox calculations (0.0 - 1.0)
   * Higher values make geometries appear at slightly higher zoom levels
   */
  bboxPaddingFactor: number;
}

/**
 * Default configuration for geometry visibility
 *
 * These values can be tuned based on user feedback and testing:
 * - Adjust zoomThresholds to change when different sized geometries appear
 * - Adjust alwaysClusterBelowZoom to control when shapes start appearing
 * - Adjust neverClusterAboveZoom to control when clustering stops
 */
export const defaultGeometryVisibilityConfig: GeometryVisibilityConfig = {
  zoomThresholds: [
    { maxSpan: 10, minZoom: 6 },    // Very large (countries, major regions) - visible at continental zoom
    { maxSpan: 1, minZoom: 8 },     // Large (regions, states) - visible at country zoom
    { maxSpan: 0.5, minZoom: 10 },  // Medium-large (cities, large areas) - visible at regional zoom
    { maxSpan: 0.1, minZoom: 12 },  // Medium (districts, neighborhoods) - visible at city zoom
    { maxSpan: 0.01, minZoom: 14 }, // Small (streets, blocks) - visible at neighborhood zoom
    { maxSpan: 0, minZoom: 16 },    // Very small (buildings, points) - visible at street zoom
  ],
  alwaysClusterBelowZoom: 8,
  neverClusterAboveZoom: 18,
  defaultMinZoom: 14,
  bboxPaddingFactor: 0.1, // 10% padding
};

/**
 * Alternative configuration for more aggressive geometry display
 * Shows shapes earlier (at lower zoom levels)
 */
export const aggressiveGeometryVisibilityConfig: GeometryVisibilityConfig = {
  zoomThresholds: [
    { maxSpan: 10, minZoom: 4 },
    { maxSpan: 1, minZoom: 6 },
    { maxSpan: 0.5, minZoom: 8 },
    { maxSpan: 0.1, minZoom: 10 },
    { maxSpan: 0.01, minZoom: 12 },
    { maxSpan: 0, minZoom: 14 },
  ],
  alwaysClusterBelowZoom: 6,
  neverClusterAboveZoom: 18,
  defaultMinZoom: 12,
  bboxPaddingFactor: 0.05,
};

/**
 * Alternative configuration for conservative geometry display
 * Shows shapes later (at higher zoom levels)
 */
export const conservativeGeometryVisibilityConfig: GeometryVisibilityConfig = {
  zoomThresholds: [
    { maxSpan: 10, minZoom: 8 },
    { maxSpan: 1, minZoom: 10 },
    { maxSpan: 0.5, minZoom: 12 },
    { maxSpan: 0.1, minZoom: 14 },
    { maxSpan: 0.01, minZoom: 16 },
    { maxSpan: 0, minZoom: 18 },
  ],
  alwaysClusterBelowZoom: 10,
  neverClusterAboveZoom: 20,
  defaultMinZoom: 16,
  bboxPaddingFactor: 0.15,
};

/**
 * Get the active configuration
 * This can be extended to load from user preferences or dataset configuration
 */
export const getGeometryVisibilityConfig = (): GeometryVisibilityConfig => {
  // For now, return default config
  // In the future, this could:
  // - Load from localStorage
  // - Load from API/dataset configuration
  // - Switch based on environment variables
  return defaultGeometryVisibilityConfig;
};
