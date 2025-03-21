// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useRouteQuery } from '@vueuse/router';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import {
  mapDefaultCoordinates,
  mapDefaultZoom,
} from '../../../../../components/map/consts';
import { ClusterFeature, MarkerFeature } from '../types';

export const useMapViewUiStore = defineStore('mapViewUiStore', () => {
  const showFilter = ref(false);
  const showMarkerDetail = ref(false);
  const activeMarker = ref<MarkerFeature | undefined>();
  const activeCluster = ref<ClusterFeature | undefined>();

  const mapCenter = useRouteQuery<string | undefined, [number, number]>(
    'mapCenter',
    [mapDefaultCoordinates.lng, mapDefaultCoordinates.lat].join(','),
    {
      transform: {
        get: (value) => value?.split(',').map(Number) as [number, number],
        set: (value) => value.join(','),
      },
    }
  );

  const mapZoom = useRouteQuery('mapZoom', mapDefaultZoom, {
    transform: Number,
  });

  const datasetIds = useRouteQuery<string | undefined, string[] | undefined>(
    'datasetIds',
    '',
    {
      transform: {
        get: (value) => value?.split(','),
        set: (value) => value?.join(','),
      },
    }
  );

  const activeRecord = useRouteQuery<
    string | undefined,
    | {
        datasetId: string;
        recordId: string;
      }
    | undefined
  >('activeRecord', '', {
    transform: {
      get: (value) => {
        if (value == null || value.length === 0) {
          return;
        }
        const [datasetId, recordId] = value.split(',');
        return { datasetId, recordId };
      },
      set: (value) => {
        if (
          value == null ||
          value.datasetId == null ||
          value.recordId == null
        ) {
          return;
        }
        return `${value.datasetId},${value.recordId}`;
      },
    },
  });

  return {
    activeMarker,
    activeCluster,
    activeRecord,
    mapCenter,
    mapZoom,
    showFilter,
    showMarkerDetail,
    datasetIds,
  };
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapViewUiStore, import.meta.hot));
}
