// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import { toRefs } from 'vue';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { useDatasetView } from './datasetView';

export const useDatasetViewStore = defineStore('datasetViewStore', () => {
  // Note: using toRefs here instead of storeToRefs because storeToRefs
  // breaks hot module reload for the "baseViews" property, the reason is
  // unknown at the moment.
  // Using toRefs instead of storeToRefs could be an issue if some store
  // properties were not present during this invocation, because toRefs
  // will only generate refs for properties that are enumerable on the
  // source object at call time (see https://vuejs.org/api/reactivity-utilities.html#torefs),
  // while storeToRefs uses the toRef function with name parameter internally
  // (see https://vuejs.org/api/reactivity-utilities.html#toref), which
  // returns a usable ref even if the source property doesn't exist.
  // In our case we are sure that all properties are present (in the store
  // itself they are refs / computed values), so it is not an issue.
  // See also: https://github.com/vuejs/pinia/blob/v2/packages/pinia/src/storeToRefs.ts
  const {
    datasetDomain,
    baseViews,
    viewKey,
    stringReplacer,
    objectValueReplacer,
  } = toRefs(useDatasetBaseInfoStore());

  return useDatasetView(
    datasetDomain,
    baseViews,
    viewKey,
    stringReplacer,
    objectValueReplacer
  );
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDatasetViewStore, import.meta.hot));
}
