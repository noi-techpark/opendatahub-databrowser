// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import { useComputeDatasetPermission } from './datasetPermission';

export const useDatasetPermissionStore = defineStore(
  'datasetPermissionStore',
  () => {
    const { isEmbeddedSource, isUserSource, operations } = storeToRefs(
      useDatasetBaseInfoStore()
    );
    const { hasEditView, hasNewView } = storeToRefs(useDatasetViewStore());
    return useComputeDatasetPermission({
      isEmbeddedSource,
      isUserSource,
      operations,
      hasEditView,
      hasNewView,
    });
  }
);

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useDatasetPermissionStore, import.meta.hot)
  );
}
