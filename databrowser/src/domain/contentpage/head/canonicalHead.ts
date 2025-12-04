// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { stringifyQuery, useRouter } from 'vue-router';

const ignoredCanonicalQueryParams = [
  // Common params
  'language',
  // Other params that maybe should be ignored in canonical URL
  //   // Content API
  //   'language',
  //   'pagenumber',
  //   'pagesize',
  //   'rawfilter',
  //   'rawsort',
  //   'searchfilter',
  //   'articletype',
  //   'source',
  //   'tagfilter',
  //   'typefilter',
  //   // Timeseries API
  //   'limit',
  //   'offset',
  //   'where',
];

export const useCanonicalHead = () => {
  const router = useRouter();

  useHead({
    link: computed(() => {
      const origin = window.location.origin;
      const { path, query, hash } = router.currentRoute.value;
      const canonicalQuery = { ...query };
      for (const param of ignoredCanonicalQueryParams) {
        delete canonicalQuery[param];
      }
      const searchParams = stringifyQuery(canonicalQuery);
      const canonicalPath =
        path + (searchParams ? `?${searchParams}` : '') + hash;

      return [
        {
          rel: 'canonical',
          href: origin + canonicalPath,
        },
      ];
    }),
  });
};
