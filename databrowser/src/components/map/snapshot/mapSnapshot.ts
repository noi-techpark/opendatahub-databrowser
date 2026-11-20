// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Map } from 'maplibre-gl';
import { mapStyleUrl } from '../consts';
import { LatLngPosition } from '../types';
// Imported for its side effect: it configures the MapLibre worker URL
import '../utils';

/**
 * Renders static map images with a single, shared, hidden MapLibre map.
 *
 * Browsers only allow a limited number of WebGL contexts at the same time
 * (about 16 in Chrome), so places that show many maps at once (e.g. table
 * rows) can't create one MapLibre map each. Instead, they request a snapshot
 * here: the requests are rendered one after the other by the same map and
 * returned as image data URLs.
 */

// All snapshots share one size, so the hidden map never needs to be resized.
// Consumers display them with object-fit: cover, which keeps the center.
export const snapshotWidth = 320;
export const snapshotHeight = 128;

// Give up waiting for tiles after this time and take the snapshot anyway
const renderTimeoutMs = 5000;
// Release the WebGL context when no snapshot was requested for this time
const teardownDelayMs = 60_000;
// Maximum number of cached snapshots (JPEG data URLs of ~10-20 KB each)
const maxCacheSize = 200;

const cache = new globalThis.Map<string, Promise<string>>();

let map: Map | undefined;
let container: HTMLDivElement | undefined;
let mapLoaded: Promise<void> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let pending = 0;
let teardownTimeout: ReturnType<typeof setTimeout> | undefined;

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
      // Keep the drawn frame readable, otherwise the canvas may be empty
      // when toDataURL() is called
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    const currentMap = map;
    mapLoaded = new Promise((resolve, reject) => {
      currentMap.once('load', () => resolve());
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
    // Make sure a frame is drawn even if the view didn't change
    currentMap.triggerRepaint();
  });

const render = async (center: LatLngPosition, zoom: number) => {
  const currentMap = await ensureMap();
  currentMap.jumpTo({ center, zoom });
  await waitForIdle(currentMap);
  return currentMap.getCanvas().toDataURL('image/jpeg', 0.85);
};

/**
 * Get a static image (as data URL) of the map centered on the given position.
 * Results are cached, concurrent requests are rendered one at a time.
 */
export const getMapSnapshot = (
  center: LatLngPosition,
  zoom: number
): Promise<string> => {
  const key = `${center.lat.toFixed(6)},${center.lng.toFixed(6)},${zoom}`;

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
    .then(() => render(center, zoom))
    .finally(() => {
      pending--;
      if (pending === 0) {
        teardownTimeout = setTimeout(teardown, teardownDelayMs);
      }
    });
  // A failed snapshot must not block the following ones
  queue = snapshot.catch(() => undefined);

  // Don't cache failures, so they can be retried later
  snapshot.catch(() => cache.delete(key));

  cache.set(key, snapshot);
  if (cache.size > maxCacheSize) {
    cache.delete(cache.keys().next().value!);
  }

  return snapshot;
};
