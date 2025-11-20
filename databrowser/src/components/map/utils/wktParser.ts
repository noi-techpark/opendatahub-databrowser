// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Feature, Geometry, Position } from 'geojson';

/**
 * Parse WKT (Well-Known Text) to GeoJSON
 * Supports: POINT, LINESTRING, POLYGON, MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION
 */

/**
 * Parse coordinate string to Position array
 * Example: "30 10" -> [30, 10]
 */
const parseCoordinate = (coord: string): Position => {
  const parts = coord.trim().split(/\s+/);
  return parts.map(Number);
};

/**
 * Parse coordinate list
 * Example: "30 10, 10 30, 40 40" -> [[30, 10], [10, 30], [40, 40]]
 */
const parseCoordinates = (coords: string): Position[] => {
  return coords
    .split(',')
    .map((coord) => parseCoordinate(coord))
    .filter((coord) => coord.length >= 2);
};

/**
 * Parse ring of coordinates (for polygons)
 * Example: "(30 10, 40 40, 20 40, 10 20, 30 10)" -> [[30, 10], [40, 40], ...]
 */
const parseRing = (ring: string): Position[] => {
  const cleaned = ring.replace(/^\(|\)$/g, '').trim();
  return parseCoordinates(cleaned);
};

/**
 * Parse multiple rings (for polygons with holes)
 * Example: "((30 10, 40 40, 20 40, 30 10), (20 15, 25 25, 15 25, 20 15))"
 */
const parseRings = (rings: string): Position[][] => {
  const ringMatches = rings.match(/\([^()]+\)/g);
  if (!ringMatches) return [];
  return ringMatches.map((ring) => parseRing(ring));
};

/**
 * Parse POINT WKT
 * Example: "POINT (30 10)" -> GeoJSON Point
 */
const parsePoint = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/POINT\s*\(([^)]+)\)/i);
  if (!coordMatch) throw new Error('Invalid POINT WKT');

  return {
    type: 'Point',
    coordinates: parseCoordinate(coordMatch[1]),
  };
};

/**
 * Parse LINESTRING WKT
 * Example: "LINESTRING (30 10, 10 30, 40 40)" -> GeoJSON LineString
 */
const parseLineString = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/LINESTRING\s*\(([^)]+)\)/i);
  if (!coordMatch) throw new Error('Invalid LINESTRING WKT');

  return {
    type: 'LineString',
    coordinates: parseCoordinates(coordMatch[1]),
  };
};

/**
 * Parse POLYGON WKT
 * Example: "POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))" -> GeoJSON Polygon
 */
const parsePolygon = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/POLYGON\s*\((.+)\)/i);
  if (!coordMatch) throw new Error('Invalid POLYGON WKT');

  return {
    type: 'Polygon',
    coordinates: parseRings(coordMatch[1]),
  };
};

/**
 * Parse MULTIPOINT WKT
 * Example: "MULTIPOINT ((10 40), (40 30))" or "MULTIPOINT (10 40, 40 30)"
 */
const parseMultiPoint = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/MULTIPOINT\s*\((.+)\)/i);
  if (!coordMatch) throw new Error('Invalid MULTIPOINT WKT');

  const coords = coordMatch[1];
  // Handle both "((10 40), (40 30))" and "(10 40, 40 30)" formats
  const points = coords.includes('(')
    ? coords.match(/\(([^)]+)\)/g)?.map((p) => parseCoordinate(p.slice(1, -1))) || []
    : parseCoordinates(coords);

  return {
    type: 'MultiPoint',
    coordinates: points,
  };
};

/**
 * Parse MULTILINESTRING WKT
 * Example: "MULTILINESTRING ((10 10, 20 20), (40 40, 30 30))"
 */
const parseMultiLineString = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/MULTILINESTRING\s*\((.+)\)/i);
  if (!coordMatch) throw new Error('Invalid MULTILINESTRING WKT');

  const lines = coordMatch[1].match(/\([^()]+\)/g);
  if (!lines) throw new Error('Invalid MULTILINESTRING format');

  return {
    type: 'MultiLineString',
    coordinates: lines.map((line) => parseRing(line)),
  };
};

/**
 * Parse MULTIPOLYGON WKT
 * Example: "MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))"
 */
const parseMultiPolygon = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/MULTIPOLYGON\s*\((.+)\)/i);
  if (!coordMatch) throw new Error('Invalid MULTIPOLYGON WKT');

  // Match each polygon (set of rings)
  const polygons: Position[][][] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < coordMatch[1].length; i++) {
    if (coordMatch[1][i] === '(') {
      if (depth === 0) start = i;
      depth++;
    } else if (coordMatch[1][i] === ')') {
      depth--;
      if (depth === 0) {
        const polygonStr = coordMatch[1].substring(start + 1, i);
        polygons.push(parseRings(polygonStr));
      }
    }
  }

  return {
    type: 'MultiPolygon',
    coordinates: polygons,
  };
};

/**
 * Parse GEOMETRYCOLLECTION WKT
 * Example: "GEOMETRYCOLLECTION (POINT (4 6), LINESTRING (4 6, 7 10))"
 */
const parseGeometryCollection = (wkt: string): Geometry => {
  const coordMatch = wkt.match(/GEOMETRYCOLLECTION\s*\((.+)\)/i);
  if (!coordMatch) throw new Error('Invalid GEOMETRYCOLLECTION WKT');

  const geometries: Geometry[] = [];
  const content = coordMatch[1];

  // Extract individual geometries
  const geometryRegex = /(POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON)\s*\([^)]*(?:\([^)]*\))*[^)]*\)/gi;
  const matches = content.match(geometryRegex);

  if (matches) {
    matches.forEach((geomWkt) => {
      geometries.push(parseWKT(geomWkt));
    });
  }

  return {
    type: 'GeometryCollection',
    geometries,
  };
};

/**
 * Main WKT parser - converts WKT string to GeoJSON Geometry
 */
export const parseWKT = (wkt: string): Geometry => {
  if (!wkt || typeof wkt !== 'string') {
    throw new Error('Invalid WKT: input must be a non-empty string');
  }

  const trimmed = wkt.trim().toUpperCase();

  if (trimmed.startsWith('POINT')) {
    return parsePoint(wkt);
  } else if (trimmed.startsWith('LINESTRING')) {
    return parseLineString(wkt);
  } else if (trimmed.startsWith('POLYGON')) {
    return parsePolygon(wkt);
  } else if (trimmed.startsWith('MULTIPOINT')) {
    return parseMultiPoint(wkt);
  } else if (trimmed.startsWith('MULTILINESTRING')) {
    return parseMultiLineString(wkt);
  } else if (trimmed.startsWith('MULTIPOLYGON')) {
    return parseMultiPolygon(wkt);
  } else if (trimmed.startsWith('GEOMETRYCOLLECTION')) {
    return parseGeometryCollection(wkt);
  } else {
    throw new Error(`Unsupported WKT geometry type: ${trimmed.split('(')[0]}`);
  }
};

/**
 * Convert WKT to GeoJSON Feature
 */
export const wktToGeoJSON = (wkt: string, properties: Record<string, unknown> = {}): Feature => {
  return {
    type: 'Feature',
    geometry: parseWKT(wkt),
    properties,
  };
};

/**
 * Convert GeoJSON Geometry to WKT string
 */
export const geoJSONToWKT = (geometry: Geometry): string => {
  switch (geometry.type) {
    case 'Point':
      return `POINT (${geometry.coordinates.join(' ')})`;

    case 'LineString':
      return `LINESTRING (${geometry.coordinates.map((c) => c.join(' ')).join(', ')})`;

    case 'Polygon':
      return `POLYGON (${geometry.coordinates.map((ring) => `(${ring.map((c) => c.join(' ')).join(', ')})`).join(', ')})`;

    case 'MultiPoint':
      return `MULTIPOINT (${geometry.coordinates.map((c) => `(${c.join(' ')})`).join(', ')})`;

    case 'MultiLineString':
      return `MULTILINESTRING (${geometry.coordinates.map((line) => `(${line.map((c) => c.join(' ')).join(', ')})`).join(', ')})`;

    case 'MultiPolygon':
      return `MULTIPOLYGON (${geometry.coordinates.map((polygon) => `(${polygon.map((ring) => `(${ring.map((c) => c.join(' ')).join(', ')})`).join(', ')})`).join(', ')})`;

    case 'GeometryCollection':
      return `GEOMETRYCOLLECTION (${geometry.geometries.map(geoJSONToWKT).join(', ')})`;

    default:
      throw new Error(`Unsupported geometry type: ${(geometry as Geometry).type}`);
  }
};
