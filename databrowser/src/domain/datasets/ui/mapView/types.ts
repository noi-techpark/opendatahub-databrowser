// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  BBox,
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Polygon,
} from 'geojson';
import { GeoJSONSourceSpecification } from 'maplibre-gl';
import { CoordinateSource, TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { KnownApiType } from '../../../metaDataConfig/types';

export type DatasetId = string;
export type RecordId = string;

export interface ClusterNode {
  type: 'Feature';
  geometry: Geometry;
  properties: MapRecord;
}

export interface MarkerFeature {
  datasetId: DatasetId;
  recordId: RecordId;
  name: string;
  abbreviation: string;
  color: string;
}

export interface ClusterFeature extends MarkerFeature {
  count: number;
  markers: MapRecord[];
  convexHull: Feature<Polygon, GeoJsonProperties> | null;
  bbox: BBox;
}

export interface MapRecord {
  recordId: RecordId;
  recordName: string;
}

export interface MapDatasetApi {
  apiType: KnownApiType;
  apiUrl: NonNullable<TourismMetaData['externalLink']>;
}

export interface MapDatasetMetaData {
  datasetId: DatasetId;
  datasetName: string;
  datasetAbbreviation: string;
  datasetColor: string;
  datasetParentId?: DatasetId;
  coordinateSource?: CoordinateSource;
}

export interface MapSourceSpecification extends GeoJSONSourceSpecification {
  data: FeatureCollection<
    Geometry,
    {
      recordId: RecordId;
      recordName: string;
    }
  >;
}

/**
 * Separate sources for different geometry types
 * Points can be clustered, while LineStrings and Polygons cannot
 */
export interface MapSourcesByGeometryType {
  points?: MapSourceSpecification & { cluster: true };
  lines?: MapSourceSpecification & { cluster: false };
  polygons?: MapSourceSpecification & { cluster: false };
}

export interface DatasetRecords {
  fetching: boolean;
  fetched: boolean;
  error: string | null;
  count: number;
  // Source can be either a single source (legacy) or multiple sources by geometry type (GeoData)
  source: MapSourceSpecification | MapSourcesByGeometryType;
}

export interface MapDataset {
  api: MapDatasetApi;
  metaData: MapDatasetMetaData;
  selected: boolean;
  records: DatasetRecords;
}
