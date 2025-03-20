// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
  Polygon,
} from 'geojson';
import { GeoJSONSourceSpecification } from 'maplibre-gl';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
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
}

export interface MapSourceSpecification extends GeoJSONSourceSpecification {
  data: FeatureCollection<
    Point,
    {
      recordId: RecordId;
      recordName: string;
    }
  >;
}

export interface DatasetRecords {
  fetching: boolean;
  fetched: boolean;
  error: string | null;
  count: number;
  source: MapSourceSpecification;
}

export interface MapDataset {
  api: MapDatasetApi;
  metaData: MapDatasetMetaData;
  selected: boolean;
  records: DatasetRecords;
}
