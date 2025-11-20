// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ApiType } from '../types';

/**
 * Configuration for extracting coordinates from dataset records
 */
export type CoordinateSourceType = 'legacy' | 'geoData';

export interface LegacyCoordinateSource {
  type: 'legacy';
  // Uses default extraction based on apiType:
  // - content: GpsInfo[0].Longitude, GpsInfo[0].Latitude
  // - timeseries: scoordinate.x, scoordinate.y
}

export interface GeoDataCoordinateSource {
  type: 'geoData';
  field: string;        // Field name containing GeoData (e.g., 'GeoData')
  useDefault: boolean;  // If true, uses entry where Default === true
}

export interface GeoShapeReferenceCoordinateSource {
  type: 'geoShapeReference';
  field: string;        // Field name containing GeoShape references (e.g., 'GpsTrack')
  useFirst: boolean;    // If true, uses first element of array
}

export type CoordinateSource =
  | LegacyCoordinateSource
  | GeoDataCoordinateSource
  | GeoShapeReferenceCoordinateSource;

export interface TourismMetaData {
  id: string;
  baseUrl: string;
  shortname: string;
  description?: string;
  output: string;
  swaggerUrl?: string;
  access: 'opendata' | 'limited' | 'closed' | 'unknown';
  pathSegments: string[];
  externalLink?: string;
  sources: string[];
  lastUpdated?: Date;
  apiFilter: Record<string, string>;
  recordCount: { open?: number; closed?: number; reduced?: number };
  deprecated?: boolean;
  parent?: TourismMetaData;
  tags: string[];
  hasNoMetadata?: boolean;
  dataSpace?: string;
  apiType: ApiType;
  categories: string[];
  dataProviders: string[];
  singleDataset?: boolean;
  datasetConfigurations: string[];
  licenseInfo?: { author?: string; license?: string; closedData?: boolean; licenseHolder?: string   }
  // Configuration for extracting coordinates/geometry from records
  // If not specified, uses legacy extraction based on apiType
  coordinateSource?: CoordinateSource;
}
