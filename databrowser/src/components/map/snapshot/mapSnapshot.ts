// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { GeoJSONSource, LngLatBounds, Map } from 'maplibre-gl';
import { mapStyleUrl } from '../consts';
import { parseWKT } from '../utils/wktParser';
// Imported for its side effect: it configures the MapLibre worker URL
import '../utils';

/**
 * Renders static map images of WKT geometries with a single, shared, hidden
 * MapLibre map.
 *
 * Browsers only allow a limited number of WebGL contexts at the same time
 * (about 16 in Chrome), so places that show many maps at once (e.g. table
 * rows) can't create one MapLibre map each. Instead, they request a snapshot
 * here: the requests are rendered one after the other by the same map and
 * returned as image data URLs.
 */

// All snapshots share one size (in CSS pixels), so the hidden map never needs
// to be resized. They are rendered at twice that resolution to stay sharp on
// high density displays.
export const snapshotWidth = 144;
export const snapshotHeight = 96;
const snapshotPixelRatio = 2;

// Zoom used for single points, same as the interactive GeoDataMap
const pointZoom = 12;
// Space between the geometry and the image border when fitting its bounds
const fitPadding = 12;
const fitMaxZoom = 16;

// Give up waiting for tiles after this time and take the snapshot anyway
const renderTimeoutMs = 5000;
// Release the WebGL context when no snapshot was requested for this time
const teardownDelayMs = 60_000;
// Maximum number of cached snapshots (JPEG data URLs of ~10-20 KB each)
const maxCacheSize = 200;

const sourceId = 'snapshot-geometry';
// Same colors as the EditableWktMap display styles
const geometryColor = '#476929';
const pointColor = '#3FB1CE';

const cache = new globalThis.Map<string, Promise<string>>();

let map: Map | undefined;
let container: HTMLDivElement | undefined;
let mapLoaded: Promise<void> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let pending = 0;
let teardownTimeout: ReturnType<typeof setTimeout> | undefined;

const addGeometryLayers = (currentMap: Map) => {
  currentMap.addSource(sourceId, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  });
  currentMap.addLayer({
    id: `${sourceId}-fill`,
    type: 'fill',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
    paint: { 'fill-color': geometryColor, 'fill-opacity': 0.3 },
  });
  currentMap.addLayer({
    id: `${sourceId}-line`,
    type: 'line',
    source: sourceId,
    // Also draws the outline of polygons
    filter: [
      'in',
      ['geometry-type'],
      ['literal', ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']],
    ],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': geometryColor, 'line-width': 2 },
  });
  currentMap.addLayer({
    id: `${sourceId}-point`,
    type: 'circle',
    source: sourceId,
    filter: ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
    paint: {
      'circle-radius': 6,
      'circle-color': pointColor,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
};

const ensureMap = (): Promise<Map> => {
  if (map == null) {
    container = document.createElement('div');
    container.setAttribute('aria-hidden', 'true');
    Object.assign(container.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: `${snapshotWidth}px`,
      height: `${snapshotHeight}px`,
      pointerEvents: 'none',
    });
    document.body.appendChild(container);

    map = new Map({
      container,
      style: mapStyleUrl,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      pixelRatio: snapshotPixelRatio,
      // Keep the drawn frame readable, otherwise the canvas may be empty
      // when toDataURL() is called
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    const currentMap = map;
    mapLoaded = new Promise((resolve, reject) => {
      currentMap.once('load', () => {
        addGeometryLayers(currentMap);
        resolve();
      });
      currentMap.once('error', (event) => {
        if (!currentMap.loaded()) {
          reject(event.error);
        }
      });
    });
  }

  const currentMap = map;
  return mapLoaded!.then(() => currentMap);
};

const teardown = () => {
  map?.remove();
  container?.remove();
  map = undefined;
  container = undefined;
  mapLoaded = undefined;
};

const waitForIdle = (currentMap: Map) =>
  new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, renderTimeoutMs);
    currentMap.once('idle', () => {
      clearTimeout(timeout);
      resolve();
    });
    // Make sure a frame is drawn even if nothing changed
    currentMap.triggerRepaint();
  });

// Split geometry collections, GeoJSON sources don't render them reliably
const toFeatures = (geometry: Geometry): Feature[] =>
  geometry.type === 'GeometryCollection'
    ? geometry.geometries.flatMap(toFeatures)
    : [{ type: 'Feature', geometry, properties: {} }];

const getBounds = (features: Feature[]) => {
  const bounds = new LngLatBounds();
  const extend = (coords: unknown): void => {
    if (!Array.isArray(coords)) {
      return;
    }
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      bounds.extend([coords[0], coords[1]]);
    } else {
      coords.forEach(extend);
    }
  };
  features.forEach(({ geometry }) => {
    if ('coordinates' in geometry) {
      extend(geometry.coordinates);
    }
  });
  return bounds;
};

const render = async (wkt: string) => {
  const features = toFeatures(parseWKT(wkt));
  const bounds = getBounds(features);
  if (bounds.isEmpty()) {
    throw new Error('Geometry has no coordinates');
  }

  const currentMap = await ensureMap();
  const data: FeatureCollection = { type: 'FeatureCollection', features };
  currentMap.getSource<GeoJSONSource>(sourceId)?.setData(data);

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  if (ne.lat === sw.lat && ne.lng === sw.lng) {
    currentMap.jumpTo({ center: ne, zoom: pointZoom });
  } else {
    currentMap.fitBounds(bounds, {
      padding: fitPadding,
      maxZoom: fitMaxZoom,
      animate: false,
    });
  }

  await waitForIdle(currentMap);
  return currentMap.getCanvas().toDataURL('image/jpeg', 0.85);
};

/**
 * Get a static image (as data URL) of the map showing the given WKT geometry.
 * Results are cached, concurrent requests are rendered one at a time.
 */
export const getMapSnapshot = (wkt: string): Promise<string> => {
  const key = wkt.trim();

  const cached = cache.get(key);
  if (cached != null) {
    // Move to the end, so the least recently used entry is evicted first
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }

  clearTimeout(teardownTimeout);
  pending++;

  const snapshot = queue
    .then(() => render(key))
    .finally(() => {
      pending--;
      if (pending === 0) {
        teardownTimeout = setTimeout(teardown, teardownDelayMs);
      }
    });
  // A failed snapshot must not block the following ones
  queue = snapshot.catch(() => undefined);

  // Don't cache failures, so they can be retried later
  snapshot.catch(() => {
    if (cache.get(key) === snapshot) {
      cache.delete(key);
    }
  });

  cache.set(key, snapshot);
  if (cache.size > maxCacheSize) {
    cache.delete(cache.keys().next().value!);
  }

  return snapshot;
};
