// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, readonly, ref } from 'vue';
import { ClusterMapLayerTracker, LayerId } from './types';

/**
 * Keep track of layers on a clustered map.
 *
 * This tracker is useful for clustered maps, where the data to cluster can be
 * changed dynamically. This tracker keeps track of the layers that are
 * currently active on the map.
 *
 * @returns {Object} layerIds - The layer ids.
 * @returns {Object} layerIdsByDatasetId - The layer ids by dataset id.
 * @returns {Function} addLayerId - Add a layer id.
 * @returns {Function} removeLayerId - Remove a layer id.
 * @returns {Function} hasLayerId - Check if a layer id exists.
 */
export const useClusterMapLayerTracker = (): ClusterMapLayerTracker => {
  const layerIdsByDatasetId = ref<Record<string, LayerId>>({});

  const addLayerId = (datasetId: string, layerId: LayerId) => {
    layerIdsByDatasetId.value = {
      ...layerIdsByDatasetId.value,
      [datasetId]: layerId,
    };
  };

  const removeLayerId = (datasetId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [datasetId]: _, ...rest } = layerIdsByDatasetId.value;
    layerIdsByDatasetId.value = rest;
  };

  const hasLayerId = (datasetId: string) => {
    return datasetId in layerIdsByDatasetId.value;
  };

  const layerIds = computed(() => Object.values(layerIdsByDatasetId.value));

  return {
    layerIds,
    layerIdsByDatasetId: readonly(layerIdsByDatasetId),
    addLayerId,
    removeLayerId,
    hasLayerId,
  };
};
