// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface GeoDataEntry {
  Type?: string;
  Geometry?: string;
  Latitude?: string | number;
  Longitude?: string | number;
  Altitude?: string | number;
  Default?: boolean;
}

export interface GeoData {
  [key: string]: GeoDataEntry
}