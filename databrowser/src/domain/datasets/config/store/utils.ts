// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref, watch } from 'vue';
import { LocationQuery, useRouter } from 'vue-router';
import { DatasetDomain, DatasetQuery, ViewKey } from '../types';

export const useQueryParamsCleanUp = (
  viewKey: Ref<ViewKey | undefined>,
  domain: Ref<DatasetDomain | undefined>,
  datasetQuery: Ref<DatasetQuery | undefined>
) => {
  const router = useRouter();
  const { currentRoute } = router;

  // Watch datasetQuery changes and update route if:
  // - search or filters changed => jump to first page
  // - default values are part of query params => remove them from URL
  watch(
    [viewKey, datasetQuery],
    (
      [viewKeyValue, datasetQueryValue],
      [viewKeyOldValue, datasetQueryOldValue]
    ) => {
      // Remove current pagination param from query if search or filters changed,
      // but only if the view did not change. For example, if the user is in the
      // table view on the second page of the results and changes the search, we
      // want to show the first page of the results, but if the user changes from
      // the detail view to the table view, we don't want to remove the pagination
      // information.
      const searchAndFilterParamsCleanup =
        viewKeyValue === viewKeyOldValue
          ? removePaginationParamIfSearchOrFiltersChanged(
              domain.value,
              datasetQueryValue,
              datasetQueryOldValue,
              currentRoute.value.query
            )
          : { updateRoute: false, routeQuery: currentRoute.value.query };

      // Add preferred query params if they are not already present
      // This is useful e.g. to ensure that the user preferred language is
      // always present in the URL, even if the user did not explicitly set it.
      const preferredParams = addPreferredParams(
        datasetQueryValue,
        currentRoute.value.query
      );

      // Remove default query param values if they are present in the URL.
      // This is a pure esthetical function, to avoid showing default values
      // in the URL.
      const defaultParamsCleanup = removeDefaultParams(
        datasetQueryValue,
        preferredParams.routeQuery
      );

      // Update route if needed
      if (
        searchAndFilterParamsCleanup.updateRoute ||
        preferredParams.updateRoute ||
        defaultParamsCleanup.updateRoute
      ) {
        const query = intersectQueryParams(
          preferredParams.routeQuery,
          defaultParamsCleanup.routeQuery
        );
        setTimeout(() => router.replace({ query }));
      }
    },
    { immediate: true }
  );
};

// Remove current pagination info from query param if search or
// filters changed. The idea is to show the user the first page
// of the results when the search or filters change.
export const removePaginationParamIfSearchOrFiltersChanged = (
  domain: DatasetDomain | undefined,
  datasetQuery: DatasetQuery | undefined,
  datasetQueryOld: DatasetQuery | undefined,
  currentLocation: LocationQuery
): { updateRoute: boolean; routeQuery: LocationQuery } => {
  // Check if search or filters changed
  const searchOrFiltersChanged = hasSearchOrFiltersChanged(
    domain,
    datasetQuery,
    datasetQueryOld
  );

  if (searchOrFiltersChanged) {
    // Remove page location param for tourism
    if (domain === 'tourism') {
      const routeQuery = { ...currentLocation };
      delete routeQuery['pagenumber'];
      return { updateRoute: true, routeQuery };
    }
    // Remove page location param for mobility
    if (domain === 'mobility') {
      const routeQuery = { ...currentLocation };
      delete routeQuery['offset'];
      return { updateRoute: true, routeQuery };
    }
  }

  return { updateRoute: false, routeQuery: currentLocation };
};

// Add preferred query params if they are not already present
// This is useful to ensure that the user preferred language is always
// present in the URL, even if the user did not explicitly set it.
export const addPreferredParams = (
  datasetQuery: DatasetQuery | undefined,
  currentLocation: LocationQuery
) => {
  if (datasetQuery?.preferred == null) {
    return { updateRoute: false, routeQuery: currentLocation };
  }

  const routeQuery = { ...currentLocation };

  let routeQueryChanged = false;
  // Add preferred query params
  Object.entries(datasetQuery?.preferred).forEach(([key, value]) => {
    if (routeQuery[key] == null) {
      routeQuery[key] = value;
      routeQueryChanged = true;
    }
  });

  return { updateRoute: routeQueryChanged, routeQuery };
};

// Remove default query params. This is a pure esthetical
// function, to avoid showing default values in the URL.
export const removeDefaultParams = (
  datasetQuery: DatasetQuery | undefined,
  currentLocation: LocationQuery
): { updateRoute: boolean; routeQuery: LocationQuery } => {
  if (datasetQuery?.default == null) {
    return { updateRoute: false, routeQuery: currentLocation };
  }

  const routeQuery = { ...currentLocation };

  let routeQueryChanged = false;
  // Remove default values from query params
  Object.entries(datasetQuery?.default).forEach(([key, value]) => {
    if (routeQuery[key] === value) {
      delete routeQuery[key];
      routeQueryChanged = true;
    }
  });

  return { updateRoute: routeQueryChanged, routeQuery };
};

// Intersect query params, the result will be a new object
// with only the keys that are present in both objects
export const intersectQueryParams = (
  query1: LocationQuery,
  query2: LocationQuery
): LocationQuery => {
  return Object.keys(query1).reduce<LocationQuery>((acc, key) => {
    if (query2[key] != null) {
      acc[key] = query1[key];
    }
    return acc;
  }, {});
};

// Check if search or filters changed
const hasSearchOrFiltersChanged = (
  domain: DatasetDomain | undefined,
  datasetQuery: DatasetQuery | undefined,
  datasetQueryOld: DatasetQuery | undefined
) => {
  if (domain != null && datasetQuery != null && datasetQueryOld != null) {
    // Tourism
    if (domain === 'tourism') {
      const searchfilterChanged =
        datasetQuery.stringified.searchfilter !==
        datasetQueryOld.stringified.searchfilter;
      const rawfilterChanged =
        datasetQuery.stringified.rawfilter !==
        datasetQueryOld.stringified.rawfilter;

      return searchfilterChanged || rawfilterChanged;
    }

    // Mobility
    if (domain === 'mobility') {
      const whereChanged =
        datasetQuery.stringified.where !== datasetQueryOld.stringified.where;
      return whereChanged;
    }
  }
  return false;
};
