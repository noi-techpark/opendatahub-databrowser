// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Feature, Point } from 'geojson';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { MapRecord, MapSourceSpecification } from '../types';
import { mapClusterMaxZoom, mapClusterRadius } from '../consts';

interface ContentApiMarkerCollection {
  Id?: string;
  Shortname?: string;
  GpsInfo?: { Longitude: number; Latitude: number }[];
}

interface TimeseriesApiMarkerCollection {
  scoordinate?: { x: number; y: number };
  scode?: string;
  sname?: string;
}

type MapFeature = Feature<Point, MapRecord>;

interface FeatureParams {
  x: number;
  y: number;
  recordId: string;
  recordName: string;
}

/**
 * Compute the map source for the given records.
 *
 * The source contains all the information to be used by MapLibre without further processing.
 */
export const computeMapSource = (
  apiType: KnownApiType,
  records: unknown[]
): MapSourceSpecification => {
  // Extract the feature params (e.g. x, y, record ID, ...) from the records
  const featureParams = mapToFeatureParams(
    apiType,
    records as ContentApiMarkerCollection[] | TimeseriesApiMarkerCollection[]
  );

  // Map to map features usable in the map source
  const features = featureParams
    .filter(
      (m): m is FeatureParams =>
        m.x != null && m.y != null && m.recordId != null && m.recordName != null
    )
    .map<MapFeature>(({ x, y, recordId, recordName }) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [x, y],
      },
      properties: {
        recordId,
        recordName,
      },
    }));

  // Return the map source
  return {
    type: 'geojson',
    cluster: true,
    clusterMaxZoom: mapClusterMaxZoom, // Max zoom to cluster points on
    clusterRadius: mapClusterRadius, // Radius of each cluster when clustering points (defaults to 50)
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

const mapToFeatureParams = (
  type: KnownApiType,
  records: ContentApiMarkerCollection[] | TimeseriesApiMarkerCollection[]
): Partial<FeatureParams>[] => {
  switch (type) {
    case 'content':
      return records.map<Partial<FeatureParams>>(
        (item: ContentApiMarkerCollection) => {
          const { Id: recordId, Shortname: recordName, GpsInfo } = item;
          const x = GpsInfo?.[0]?.Longitude;
          const y = GpsInfo?.[0]?.Latitude;
          return { x, y, recordId, recordName };
        }
      );
    case 'timeseries':
      return records.map<Partial<FeatureParams>>(
        (item: TimeseriesApiMarkerCollection) => {
          const { scode: recordId, sname: recordName, scoordinate } = item;
          const x = scoordinate?.x;
          const y = scoordinate?.y;
          return { x, y, recordId, recordName };
        }
      );
  }
};
