// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useRouteQuery } from '@vueuse/router';
import { LocationQueryValue, Router } from 'vue-router';

import * as R from 'ramda';

export function setFilterAndSearchQuery(
  router: Router,
  filters: string[],
  searchQuery: string = ''
) {
  const currentQuery = router.currentRoute.value.query;
  const newQuery: { [key: string]: string | LocationQueryValue[] | null } = {
    ...currentQuery,
  };
  if (filters.length > 0) {
    newQuery['filterQuery'] = filters.join('&');
  } else {
    delete newQuery['filterQuery'];
  }

  if (searchQuery !== '') {
    newQuery['search'] = searchQuery;
  } else {
    delete newQuery['search'];
  }

  if (!R.equals(newQuery, currentQuery)) {
    router.push({ query: newQuery });
  }
}

export function getFilterAndSearchQuery() {
  const filterQuery = useRouteQuery<string[] | string | null>(
    'filterQuery'
  ).value;
  const search = useRouteQuery<string | null>('search').value;

  return {
    filterQuery: Array.isArray(filterQuery)
      ? filterQuery.join('&')
      : (filterQuery ?? ''),

    searchQuery: search,
  };
}
