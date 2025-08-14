// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserSettings } from '../../../user/userSettings';
import { useComputeRouteLocation } from '../../location/routeLocation';
import { DatasetConfigSource } from '../types';
import { useDatasetBaseInfo } from './datasetBaseInfo';
import { useQueryParamsCleanUp } from './utils';

export const useDatasetBaseInfoStore = defineStore(
  'datasetBaseInfoStore',
  () => {
    const router = useRouter();
    const { currentRoute } = router;
    const routeLocation = useComputeRouteLocation(currentRoute);

    // Current source
    const source = ref<DatasetConfigSource>('embedded');

    // User preferred source, which is stored in local storage
    // This allows the user to select a preferred source for datasets
    // and have it persist across sessions.
    const preferredSource = useUserSettings().getUserSettingRef(
      'preferredDatasetSource'
    );

    // Compute reactive dataset base info
    const baseInfo = useDatasetBaseInfo(routeLocation, preferredSource);

    // Update source state
    watch(
      baseInfo.source,
      (newSource) => {
        source.value = newSource ?? 'embedded';
      },
      { immediate: true }
    );

    // Watch datasetQuery changes and update route if:
    // - search or filters changed => jump to first page
    // - default values are part of query params => remove them from URL
    useQueryParamsCleanUp(
      baseInfo.viewKey,
      baseInfo.datasetDomain,
      baseInfo.datasetQuery
    );

    return { ...baseInfo, source };
  }
);

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useDatasetBaseInfoStore, import.meta.hot)
  );
}
