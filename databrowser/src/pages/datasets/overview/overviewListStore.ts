// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useFuse } from '@vueuse/integrations/useFuse.mjs';
import { useRouteQuery } from '@vueuse/router';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, Ref, watch } from 'vue';
import { TourismMetaData } from '../../../domain/metaDataConfig/tourism/types';
import { useMetaDataForAllDatasets } from './useDatasets';

export const useOverviewListStore = defineStore('overviewListStore', () => {
  const { isMetaDataLoading, metaData } = useMetaDataForAllDatasets();

  // Handle search term from URL
  const { searchQuery, searchTerm } = handleSearchQuery();

  // Handle filter values from URL
  const { filterQuery, filters, toggleFilter } = handleFilterQuery();

  // Compute available filters from metadata
  const availableFilters = computeAvailableFilters(metaData);

  const filteredMetaData = useFilteredMetadata(metaData, filters, searchTerm);

  // Reset all filters and search term
  const resetAllFilters = () => {
    filterQuery.value = undefined;
    searchQuery.value = undefined;
  };

  return {
    isMetaDataLoading,
    searchTerm,
    filters,
    availableFilters,
    filteredMetaData,
    resetAllFilters,
    toggleFilter,
  };
});

/**
 * Handle search query parameters from the URL
 * @returns The search query from URL and parsed search term
 */
const handleSearchQuery = () => {
  const searchQuery = useRouteQuery('search');
  const searchTerm = ref('');

  watch(searchQuery, (newVal) => {
    if (newVal == null || Array.isArray(newVal)) {
      searchTerm.value = '';
      return;
    }
    searchTerm.value = newVal;
  });

  return { searchQuery, searchTerm };
};

/**
 * Handle filter query parameters from the URL
 * @returns The filter query from URL and parsed filters, as well as a function to toggle filters
 */
const handleFilterQuery = () => {
  const filterQuery = useRouteQuery('filterQuery');
  const filters = computed<Set<string>>(() => {
    if (filterQuery.value == null || Array.isArray(filterQuery.value)) {
      return new Set<string>();
    }
    const filtersValues = filterQuery.value.split('&');
    return new Set<string>(filtersValues);
  });

  const setFilter = (filter: string) => {
    if (!filters.value.has(filter)) {
      filters.value.add(filter);
      filterQuery.value = Array.from(filters.value).join('&');
    }
  };

  const removeFilter = (filter: string) => {
    filters.value.delete(filter);
    if (filters.value.size === 0) {
      filterQuery.value = undefined;
    } else {
      filterQuery.value = Array.from(filters.value).join('&');
    }
  };

  const toggleFilter = (filter: string) => {
    if (filters.value.has(filter)) {
      removeFilter(filter);
    } else {
      setFilter(filter);
    }
  };

  return { filterQuery, filters, toggleFilter };
};

type FilterKey =
  | 'dataSpace'
  | 'categories'
  | 'tags'
  | 'datasetConfigurations'
  | 'access'
  | 'dataProviders'
  | 'sources'
  | 'singleDataset';

interface AvailableFilter {
  name: string;
  key: FilterKey;
  options: { key: string; value: string }[];
}

/**
 * Compute available filters from the metadata
 * @param metaData The metadata to compute filters from
 * @returns A computed array of available filters
 */
const computeAvailableFilters = (
  metaData: Ref<TourismMetaData[]>
): Ref<AvailableFilter[]> => {
  const availableFilters = computed<AvailableFilter[]>(() => {
    const dataSpacesIndex = new Set<string>();
    const categoriesIndex = new Set<string>();
    const tagsIndex = new Set<string>();
    const accessIndex = new Set<string>();
    const sourcesIndex = new Set<string>();
    const dataProvidersIndex = new Set<string>();

    metaData.value.forEach(
      ({ dataSpace, categories, tags, access, sources, dataProviders }) => {
        if (dataSpace != null) {
          dataSpacesIndex.add(dataSpace);
        }

        categories.forEach((category) => {
          categoriesIndex.add(category);
        });

        tags.forEach((tag) => {
          tagsIndex.add(tag);
        });

        accessIndex.add(access);

        sources.forEach((source) => {
          sourcesIndex.add(source);
        });

        dataProviders.forEach((provider) => {
          dataProvidersIndex.add(provider);
        });
      }
    );

    return [
      {
        name: 'Dataspace',
        key: 'dataSpace',
        options: Array.from(dataSpacesIndex)
          .sort()
          .map((v) => ({
            key: v,
            value: v,
          })),
      },
      {
        name: 'Categories',
        key: 'categories',
        options: Array.from(categoriesIndex)
          .sort()
          .map((v) => ({
            key: v,
            value: v,
          })),
      },
      {
        name: 'Tags',
        key: 'tags',
        options: Array.from(tagsIndex)
          .sort()
          .map((tag) => ({ key: tag, value: tag })),
      },
      {
        name: 'Dataset configurations',
        key: 'datasetConfigurations',
        options: [
          {
            key: 'with',
            value: 'With configuration',
          },
          {
            key: 'without',
            value: 'Without configuration',
          },
        ],
      },
      {
        name: 'Access type',
        key: 'access',
        options: Array.from(accessIndex)
          .sort()
          .map((v) => ({ key: v, value: v })),
      },
      {
        name: 'Data Provider',
        key: 'dataProviders',
        options: Array.from(dataProvidersIndex)
          .sort()
          .map((v) => ({
            key: v,
            value: v,
          })),
      },
      {
        name: 'Source',
        key: 'sources',
        options: Array.from(sourcesIndex)
          .sort()
          .map((v) => ({
            key: v,
            value: v,
          })),
      },
      {
        name: 'Dataset',
        key: 'singleDataset',
        options: [
          {
            key: 'aggregated',
            value: 'Aggregated',
          },
          {
            key: 'single',
            value: 'Single',
          },
        ],
      },
    ];
  });

  return availableFilters;
};

/**
 * Composable to filter metadata based on user input
 * @param metaData The metadata to filter
 * @param activeFilters The active filters
 * @param searchTerm The search term
 * @returns The filtered metadata
 */
const useFilteredMetadata = (
  metaData: Ref<TourismMetaData[]>,
  activeFilters: Ref<Set<string>>,
  searchTerm: Ref<string>
): Ref<TourismMetaData[]> => {
  // Create a mapping of filter keys to their values
  const filterMappings = computed<Record<FilterKey, string[]>>(() => {
    const mappings: Record<FilterKey, string[]> = {
      dataSpace: [],
      categories: [],
      tags: [],
      datasetConfigurations: [],
      access: [],
      dataProviders: [],
      sources: [],
      singleDataset: [],
    };
    for (const filter of Array.from(activeFilters.value)) {
      const [key, value] = filter.split('-');
      if (key in mappings) {
        mappings[key as FilterKey].push(value);
      }
    }
    return mappings;
  });

  // First filter metadata based on active filters
  const filteredMetaData = computed(() => {
    if (activeFilters.value.size === 0) {
      return metaData.value;
    }

    return metaData.value.filter((item) => {
      // Filter metaData based on active filters
      // In order for this filter to work as expected, an item is excluded from the result
      // if a filter is active and the item does NOT match the filter criteria
      // For example, if the filter is 'dataSpace-foo' and the item.dataSpace is not 'foo',
      // the item should be excluded from the result
      for (const filter of activeFilters.value) {
        if (filter === 'hasNoMetadata' && !item.hasNoMetadata) {
          return false;
        }

        if (filter === 'deprecated' && !item.deprecated) {
          return false;
        }

        const [key, value] = filter.split('-');

        // If a dataSpace filter is active, the item must match the filter value
        if (
          key === 'dataSpace' &&
          item.dataSpace != null &&
          !filterMappings.value[key]?.includes(item.dataSpace)
        ) {
          return false;
        }

        // If a categories filter is active, the item must match one of the filter values
        if (
          key === 'categories' &&
          !item.categories.some((category) =>
            filterMappings.value[key]?.includes(category)
          )
        ) {
          return false;
        }

        // If a tags filter is active, the item must match one of the filter values
        if (
          key === 'tags' &&
          !item.tags.some((tag) => filterMappings.value[key]?.includes(tag))
        ) {
          return false;
        }

        // If a datasetConfigurations filter is active, the item must match the filter value
        // based on the "hasNoMetadata" property
        // Note: this is redundant with the "hasNoMetadata" filter, maybe it can be removed?
        if (
          key === 'datasetConfigurations' &&
          filterMappings.value[key]?.length === 1
        ) {
          if (value === 'with') {
            return item.hasNoMetadata === false || item.hasNoMetadata == null;
          }
          if (value === 'without') {
            return item.hasNoMetadata === true;
          }
        }

        // If an access filter is active, the item must match the filter value
        if (
          key === 'access' &&
          !filterMappings.value[key]?.includes(item.access)
        ) {
          return false;
        }

        // If a dataProviders filter is active, the item must match one of the filter values
        if (
          key === 'dataProviders' &&
          !item.dataProviders.some((provider) =>
            filterMappings.value[key]?.includes(provider)
          )
        ) {
          return false;
        }

        // If a sources filter is active, the item must match one of the filter values
        if (
          key === 'sources' &&
          !item.sources.some((source) =>
            filterMappings.value[key]?.includes(source)
          )
        ) {
          return false;
        }

        if (key === 'singleDataset') {
          const selectedValues = filterMappings.value[key];
          if (selectedValues.length > 0) {
            const itemIsSingle = Object.keys(item.apiFilter).length > 0;
            const matches = selectedValues.some((selectedValue) => {
              if (selectedValue === 'aggregated') return !itemIsSingle;
              if (selectedValue === 'single') return itemIsSingle;
              return true;
            });
            if (!matches) return false;
          }
        }
      }
      return true;
    });
  });

  // Second, do term search on filteredMetaData, looking for matches in 'shortname', 'description'
  const { results } = useFuse(searchTerm, filteredMetaData, {
    fuseOptions: {
      keys: ['shortname', 'description'],
      isCaseSensitive: false,
      threshold: 0.2,
      ignoreLocation: true,
    },
  });

  // This is a usability improvement for the search functionality
  // If no search term is given, return all filtered metadata
  // If a search term is given, return only the matching items
  const searchResults = computed<TourismMetaData[]>(() =>
    searchTerm.value.length === 0
      ? filteredMetaData.value
      : results.value.map((r) => r.item)
  );

  return searchResults;
};

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOverviewListStore, import.meta.hot)
  );
}
