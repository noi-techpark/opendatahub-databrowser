// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useFuse } from '@vueuse/integrations/useFuse';
import { computed, ref, Ref } from 'vue';
import { ClusterDetailLink } from './types';

export const useLinkSearch = (
  detailLinks: Ref<ClusterDetailLink[]>
): {
  searchTerm: Ref<string>;
  searchResults: Ref<ClusterDetailLink[]>;
} => {
  const searchTerm = ref('');

  const { results } = useFuse(searchTerm, detailLinks, {
    fuseOptions: {
      keys: ['name'],
      threshold: 0.3,
    },
    matchAllWhenSearchEmpty: true,
  });

  const searchResults = computed(() => {
    if (searchTerm.value.length === 0) {
      return detailLinks.value;
    }

    return results.value.map((r) => r.item);
  });

  return { searchTerm, searchResults };
};
