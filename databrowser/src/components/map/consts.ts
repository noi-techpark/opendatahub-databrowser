// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LatLngPosition } from './types';

export const mapDefaultCoordinates: Readonly<LatLngPosition> = {
  lat: 46.499692084332345,
  lng: 11.355074470529834,
};

export const mapDefaultZoom = 6;

export const mapDefaultMinZoom = 3;

export const mapDefaultMaxZoom = 18;

/**
 * The MapLibre style used by all maps.
 *
 * Defaults to OpenFreeMap's Positron style: it needs no API key, has no request
 * limits and comes closest to the look of the Carto "light_all" raster tiles
 * used before. Set VITE_APP_MAP_STYLE_URL to point an environment at another
 * provider (or at a self-hosted style) without a code change.
 */
export const mapStyleUrl =
  import.meta.env.VITE_APP_MAP_STYLE_URL ||
  'https://tiles.openfreemap.org/styles/positron';

/**
 * The attribution shown on every map, in addition to the attribution that
 * MapLibre derives from the style's own sources (tile provider, OpenMapTiles
 * and OpenStreetMap).
 */
export const mapDefaultAttribution =
  '<a target="_blank" href="https://www.opendatahub.com">OpenDataHub.com</a>';
