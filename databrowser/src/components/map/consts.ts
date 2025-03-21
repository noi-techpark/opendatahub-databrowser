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
 * @returns The default attribution control with mentions of OpenDataHub, OpenStreetMap and Carto
 */
export const mapDefaultAttribution =
  '<a target="_blank" href="https://www.opendatahub.com">OpenDataHub.com</a> | Map tiles by <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> and <a href="https://carto.com/" target="_blank">Carto</a>';
