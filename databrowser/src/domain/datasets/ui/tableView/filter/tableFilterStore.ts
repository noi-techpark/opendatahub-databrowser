// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { Ref, computed, ref, watch } from 'vue';
import { SelectOption } from '../../../../../components/select/types';
import { PropertyPath } from '../../../config/types';
import { useTableViewColsStore } from '../tableViewColsStore';
import { useDatasetFilterStore } from './datasetFilterStore';
import { Filter, FilterOperator, FilterValue } from './types';
import { useDatasetBaseInfoStore } from '../../../config/store/datasetBaseInfoStore.ts';

export const useTableFilterStore = defineStore('tableFilterStore', () => {
  const tableFilters = ref<Filter[]>([]);

  // Access datasetFilters from URL
  const { datasetFilters } = storeToRefs(useDatasetFilterStore());

  //Access datasetDomain
  const { datasetDomain } = storeToRefs(useDatasetBaseInfoStore());

  // Check if any filter is active
  const areFiltersActive = computed(() => datasetFilters.value.length > 0);

  // Get table columns
  const { cols } = storeToRefs(useTableViewColsStore());

  // Create select options for filter column select
  const filterColSelectOptions = computed<SelectOption[]>(() =>
    cols.value.map<SelectOption>((col) => ({
      label: col.title,
      value: col.firstPropertyPath,
    }))
  );

  // Update filters if datasetFilters or cols change
  const handleDatasetFiltersChange = () => {
    tableFilters.value = datasetFilters.value.map((filter) => {
      const title =
          cols.value.find((col) => col.firstPropertyPath === filter.propertyPath)
              ?.title ?? filter.propertyPath;
      return { ...filter, title };
    });
  }
  watch([datasetFilters, cols], handleDatasetFiltersChange);

  // Add empty filter
  const addEmptyFilter = () => {
    // Find first column with firstPropertyPath set
    const colWithPropertyPath = cols.value.find(
      (col) => col.firstPropertyPath != null
    );
    // If such a column exists, add a filter for it
    if (colWithPropertyPath != null) {
      addFilter(
        colWithPropertyPath.title,
        colWithPropertyPath.firstPropertyPath
      );
    }
  };

  // Add filter for a given propertyPath with default operator and value
  const addFilter = (title: string, propertyPath: PropertyPath | undefined) => {
    if (propertyPath != null) {
      tableFilters.value = [
        ...tableFilters.value,
        {
          propertyPath,
          title,
          operator: datasetDomain.value === 'tourism' ? 'like' : 'eq',
          value: '',
        },
      ];
    }
  };

  // The canFilter function returns true if there exists a propertyPath for which filtering can be performed.
  const canFilter = (propertyPath: Ref<PropertyPath | undefined>) =>
    computed(() => propertyPath.value != null);

  // The isFilterActive function returns true if there exists a filter for the given propertyPath.
  const isFilterActive = (propertyPath: Ref<PropertyPath | undefined>) =>
    computed(() => {
      if (propertyPath.value == null) {
        return false;
      }
      return (
        datasetFilters.value.filter(
          (f) => f.propertyPath === propertyPath.value
        ).length > 0
      );
    });

  // Remove all filters
  const removeAllFilters = () => {
    datasetFilters.value = []
    handleDatasetFiltersChange()
  };

  // Remove filter for a given propertyPath
  const removeFilterByPropertyPath = (propertyPath?: string) => {
    if (propertyPath != null) {
      datasetFilters.value = tableFilters.value.filter(
        (filter) => filter.propertyPath !== propertyPath
      );
    }
  };

  // Remove filter by index
  const removeFilterByIndex = (index?: number) => {
    if (index != null) {
      datasetFilters.value = tableFilters.value.filter((_, i) => i !== index);
      handleDatasetFiltersChange()
    }
  };

  // Update filter value by index and, if applyFilter is true, apply filters to URL such that they take effect
  const updateFilterValueByIndex = (
    index: number,
    operator: FilterOperator,
    value: FilterValue,
    applyFilter = true
  ) => {
    tableFilters.value = tableFilters.value.map((filter, i) =>
      i === index ? { ...filter, operator, value } : filter
    );

    // Apply filters to URL such that they take effect
    if (applyFilter) {
      datasetFilters.value = tableFilters.value;
    }
  };

  const updateFilterValueByAllSelectedTable = (
    tableFiltersSelected: Filter[], // Array of strings
    applyFilter = true
  ) => {
    tableFilters.value = tableFiltersSelected;

    // Apply filters to the URL if requested
    if (applyFilter) {
      datasetFilters.value = tableFilters.value;
    }
  };

  return {
    areFiltersActive,
    filterColSelectOptions,
    tableFilters,
    addEmptyFilter,
    addFilter,
    canFilter,
    isFilterActive,
    removeAllFilters,
    removeFilterByPropertyPath,
    removeFilterByIndex,
    updateFilterValueByIndex,
    updateFilterValueByAllSelectedTable,
  };
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTableFilterStore, import.meta.hot));
}
