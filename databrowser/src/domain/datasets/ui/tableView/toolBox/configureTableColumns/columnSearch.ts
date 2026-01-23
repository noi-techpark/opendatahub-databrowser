// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useFuse } from '@vueuse/integrations/useFuse';
import { computed, ref, Ref } from 'vue';
import { PropertyConfig } from '../../../../config/types';

export const useColumnSearch = (
  columns: Ref<PropertyConfig[]>
): {
  searchTerm: Ref<string>;
  searchResults: Ref<PropertyConfig[]>;
} => {
  const searchTerm = ref('');

  const { results } = useFuse(searchTerm, columns, {
    fuseOptions: {
      keys: ['title'],
      threshold: 0.3,
      shouldSort: false,
    },
    matchAllWhenSearchEmpty: true,
  });

  const searchResults = computed(() => results.value.map((r) => r.item));

  return { searchTerm, searchResults };
};
