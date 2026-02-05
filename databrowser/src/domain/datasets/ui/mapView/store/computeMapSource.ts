// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Feature, Geometry, Point } from 'geojson';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { CoordinateSource } from '../../../../metaDataConfig/tourism/types';
import { MapRecord, MapSourceSpecification, MapSourcesByGeometryType } from '../types';
import { mapClusterMaxZoom, mapClusterRadius } from '../consts';
import { parseWKT } from '../../../../../components/map/utils/wktParser';
import {
  calculateMinZoom,
  calculateMaxZoom,
  classifyGeometryType,
  getRepresentativePoint,
} from '../utils/geometryUtils';
import { getGeometryVisibilityConfig } from '../config/geometryVisibility';
import type { GeoDataEntry } from '../../../../cellComponents/components/cells/editGeoDataCell/types';

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

interface GeoDataRecord {
  Id?: string;
  Shortname?: string;
  [key: string]: unknown; // Fields accessed dynamically
}

type MapFeature = Feature<Point, MapRecord & { geometryType: string; minZoom: number }>;
type GeometryFeature = Feature<Geometry, MapRecord & { minZoom: number; maxZoom?: number }>;

interface FeatureParams {
  x: number;
  y: number;
  recordId: string;
  recordName: string;
}

interface GeometryRecord {
  geometry: Geometry;
  recordId: string;
  recordName: string;
}

/**
 * Compute the map source for the given records.
 * Now async to support fetching external GeoShape references.
 *
 * The source contains all the information to be used by MapLibre without further processing.
 */
export const computeMapSource = async (
  apiType: KnownApiType,
  records: unknown[],
  coordinateSource?: CoordinateSource
): Promise<MapSourceSpecification | MapSourcesByGeometryType> => {
  // Route to appropriate extraction method based on coordinate source type
  if (coordinateSource?.type === 'GeoData') {
    return computeMapSourceFromGeoData(
      records as GeoDataRecord[],
      coordinateSource.field!,
    );
  }

  // Otherwise, use legacy extraction (current behavior)
  return computeGpsMapSource(apiType, records);
};

/**
 * Legacy map source computation (existing behavior)
 * Extracts Point geometries from GpsInfo or scoordinate
 */
const computeGpsMapSource = (
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
        geometryType: 'Point',
        minZoom: getGeometryVisibilityConfig().defaultMinZoom,
      },
    }));

  // Return the map source
  return {
    type: 'geojson',
    cluster: true,
    clusterMaxZoom: mapClusterMaxZoom,
    clusterRadius: mapClusterRadius,
    data: {
      type: 'FeatureCollection',
      features,
    },
  };
};

/**
 * Map source computation for GeoData (WKT format)
 * Extracts geometries from GeoData field and creates multi-geometry sources
 */
const computeMapSourceFromGeoData = (
  records: GeoDataRecord[],
  geoDataField: string
): MapSourcesByGeometryType => {
  // Extract geometries from records
  const geometryRecords = records
    .map((record): GeometryRecord | null => {
      const recordId = record.Id;
      const recordName = record.Shortname;

      if (!recordId || !recordName) return null;

      // Access GeoData field dynamically
      const geoData = record[geoDataField] as Record<string, GeoDataEntry> | undefined;
      if (!geoData) return null;

      // Find the appropriate entry
      const geoEntry = Object.values(geoData).find((entry) => entry.Default === true);

      if (!geoEntry?.Geometry) return null;

      // Parse WKT to GeoJSON
      try {
        const geometry = parseWKT(geoEntry.Geometry);
        return {
          geometry,
          recordId,
          recordName,
        };
      } catch (error) {
        console.warn(`Failed to parse WKT for record ${recordId}:`, error);
        return null;
      }
    })
    .filter((p): p is GeometryRecord => p !== null);

  // Use shared logic to create sources
  return createMultiGeometrySources(geometryRecords);
};

/**
 * Shared logic to create multi-geometry sources from geometry records
 * This is used by both GeoData (WKT) and GeoShapeReference (GeoJSON) methods
 */
const createMultiGeometrySources = (
  geometryRecords: GeometryRecord[]
): MapSourcesByGeometryType => {
  const config = getGeometryVisibilityConfig();

  // Separate by geometry type
  const points: GeometryRecord[] = [];
  const lines: GeometryRecord[] = [];
  const polygons: GeometryRecord[] = [];

  for (const record of geometryRecords) {
    const type = classifyGeometryType(record.geometry);
    switch (type) {
      case 'point':
        points.push(record);
        break;
      case 'line':
        lines.push(record);
        break;
      case 'polygon':
        polygons.push(record);
        break;
    }
  }

  // Create cluster source with representative points for ALL geometries
  const clusterFeatures: MapFeature[] = geometryRecords.map(({ geometry, recordId, recordName }) => {
    const representativePoint = getRepresentativePoint(geometry);
    const minZoom = calculateMinZoom(geometry, config);
    const geometryType = classifyGeometryType(geometry);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: representativePoint,
      },
      properties: {
        recordId,
        recordName,
        geometryType,
        minZoom,
      },
    };
  });

  // Create sources by geometry type
  const sources: MapSourcesByGeometryType = {};

  // Always create cluster source (used for all geometries)
  if (clusterFeatures.length > 0) {
    sources.points = {
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: mapClusterMaxZoom,
      clusterRadius: mapClusterRadius,
      data: {
        type: 'FeatureCollection',
        features: clusterFeatures,
      },
    };
  }

  // Create line source (actual LineString geometries)
  if (lines.length > 0) {
    const lineFeatures: GeometryFeature[] = lines.map(({ geometry, recordId, recordName }) => ({
      type: 'Feature',
      geometry,
      properties: {
        recordId,
        recordName,
        minZoom: calculateMinZoom(geometry, config),
      },
    }));

    sources.lines = {
      type: 'geojson',
      cluster: false,
      data: {
        type: 'FeatureCollection',
        features: lineFeatures,
      },
    };
  }

  // Create polygon source (actual Polygon geometries)
  if (polygons.length > 0) {
    const polygonFeatures: GeometryFeature[] = polygons.map(({ geometry, recordId, recordName }) => {
      const minZoom = calculateMinZoom(geometry, config);
      const maxZoom = calculateMaxZoom(geometry, config);

      return {
        type: 'Feature',
        geometry,
        properties: {
          recordId,
          recordName,
          minZoom,
          maxZoom: maxZoom ?? 22, // Use 22 (max MapLibre zoom) if no maxZoom restriction
        },
      };
    });

    sources.polygons = {
      type: 'geojson',
      cluster: false,
      data: {
        type: 'FeatureCollection',
        features: polygonFeatures,
      },
    };
  }

  return sources;
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
