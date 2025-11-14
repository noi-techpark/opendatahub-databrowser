// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useComputeRouteLocation } from '../../location/routeLocation';
import { useDatasetBaseInfo } from './datasetBaseInfo';
import { useDatasetUserSettings } from './datasetUserSettings.ts';
import { useQueryParamsCleanUp } from './utils';

export const useDatasetBaseInfoStore = defineStore(
  'datasetBaseInfoStore',
  () => {
    const router = useRouter();
    const { currentRoute } = router;
    const routeLocation = useComputeRouteLocation(currentRoute);

    const userSettings = useDatasetUserSettings();

    // Compute reactive dataset base info
    const baseInfo = useDatasetBaseInfo(routeLocation, userSettings);

    // Watch datasetQuery changes and update route if:
    // - search or filters changed => jump to first page
    // - default values are part of query params => remove them from URL
    useQueryParamsCleanUp(
      baseInfo.viewKey,
      baseInfo.datasetDomain,
      baseInfo.datasetQuery
    );

    // Current source
    const source = ref(userSettings.preferredDatasetSource.value);

    // Update source state
    watch(
      baseInfo.source,
      (newSource) => {
        source.value = newSource ?? 'embedded';
      },
      { immediate: true }
    );

    return {
      ...baseInfo,
      // TODO: change code to use the source from userSettings below
      // such that "source" can be removed from the return statement
      // source: userSettings.preferredSource,
      source,
    };
  }
);

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useDatasetBaseInfoStore, import.meta.hot)
  );
}
