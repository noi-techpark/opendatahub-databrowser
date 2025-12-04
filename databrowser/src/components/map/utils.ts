// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  AttributionControl,
  LngLatBounds,
  LngLatLike,
  Map,
} from 'maplibre-gl';
import { MaybeRef, toValue, watch } from 'vue';
import { LineString, MultiLineString } from 'geojson';
import {
  mapDefaultAttribution,
  mapDefaultCoordinates,
  mapDefaultMaxZoom,
  mapDefaultMinZoom,
  mapDefaultZoom,
} from './consts';
import { MapGLOptions } from './types';

/**
 * Initialize a new Map object with the given options.
 *
 * @param mapId The HTML id of the map container.
 * @param options The options to initialize the map with.
 * @returns The initialized Map object.
 */
export const initMap = (mapId: string, options?: MapGLOptions): Map => {
  const center = options?.center || mapDefaultCoordinates;
  const zoom = options?.zoom || mapDefaultZoom;
  const minZoom = options?.minZoom || mapDefaultMinZoom;
  const maxZoom = options?.maxZoom || mapDefaultMaxZoom;
  return new Map({
    container: mapId,
    style: {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
        },
      ],
      // Taken from https://github.com/unvt/nsft/tree/main
      glyphs: '/fonts/{fontstack}.{range}.pbf?{fontstack}={range}.pbf',
    },
    center,
    zoom,
    minZoom,
    maxZoom,
    // Attribution control is handled dynamically
    attributionControl: false,
  });
};

/**
 * Handle the attribution control of the map.
 *
 * @param map The map object.
 * @param hideAttribution Whether to hide the attribution control.
 */
export const handleMapAttribution = (
  map: MaybeRef<Map | undefined>,
  hideAttribution: MaybeRef<boolean>
): void => {
  let attributionControl: AttributionControl | undefined;

  watch([() => map, () => hideAttribution], () => {
    const mapValue = toValue(map);

    if (mapValue == null) {
      return;
    }

    const hideAttributionValue = toValue(hideAttribution);

    if (
      hideAttributionValue &&
      attributionControl != null &&
      mapValue.hasControl(attributionControl)
    ) {
      mapValue.removeControl(attributionControl);
      attributionControl = undefined;
    } else if (!hideAttributionValue && attributionControl == null) {
      attributionControl = new AttributionControl({
        customAttribution: mapDefaultAttribution,
      });
      mapValue.addControl(attributionControl, 'bottom-right');
    }
  });
};

/**
 * Calculates the bounding box of a GeoJSON LineString or MultiLineString geometry.
 *
 * @param geometry The GeoJSON geometry object.
 * @returns A LngLatBounds object or null if the geometry is invalid.
 */
export const getGeoJsonBounds = (
  geometry: LineString | MultiLineString
): LngLatBounds | null => {
  const coords = geometry.coordinates;
  if (!coords || coords.length === 0) {
    return null;
  }

  // Flatten the coordinates array to handle both LineString and MultiLineString
  const flattenedCoords: LngLatLike[] = (
    geometry.type === 'LineString' ? coords : coords.flat()
  ) as LngLatLike[];

  if (flattenedCoords.length === 0) {
    return null;
  }

  // Create the initial bounds from the first coordinate
  const initialBounds = new LngLatBounds(
    flattenedCoords[0],
    flattenedCoords[0]
  );

  // Extend the bounds to include all other coordinates
  return flattenedCoords.reduce((bounds, coord) => {
    return bounds.extend(coord);
  }, initialBounds);
};