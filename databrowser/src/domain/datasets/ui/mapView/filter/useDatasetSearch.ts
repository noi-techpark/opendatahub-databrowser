// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useFuse } from '@vueuse/integrations/useFuse';
import { computed, ref, Ref } from 'vue';
import { SelectDatasetItem } from './types';

export const useDatasetSearch = (
  datasets: Ref<SelectDatasetItem[]>
): {
  searchTerm: Ref<string>;
  searchResults: Ref<SelectDatasetItem[]>;
} => {
  const searchTerm = ref('');

  const flatFilterableDatasets = computed(() => {
    return datasets.value.flatMap((d) => [d, ...(d.children ?? [])]);
  });

  const { results } = useFuse(searchTerm, flatFilterableDatasets, {
    fuseOptions: {
      keys: ['name', 'children.name'],
      threshold: 0.3,
    },
    matchAllWhenSearchEmpty: true,
  });

  const searchResults = computed(() => {
    if (searchTerm.value.length === 0) {
      return datasets.value;
    }

    const containingIds = new Set(results.value.map((r) => r.item.id));

    const datasetsWithMatch = datasets.value.filter((d) => {
      if (containingIds.has(d.id)) {
        return true;
      }

      if (d.children == null) {
        return false;
      }

      const children = d.children.filter((c) => containingIds.has(c.id));
      return children.length > 0;
    });

    return datasetsWithMatch.map((d) => {
      const children = d.children?.filter((c) => containingIds.has(c.id));
      return { ...d, children };
    });
  });

  return { searchTerm, searchResults };
};
