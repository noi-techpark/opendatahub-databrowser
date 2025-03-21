<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-col gap-2 overflow-auto md:flex">
    <div class="flex flex-1 flex-col overflow-y-hidden rounded border">
      <div class="flex items-center justify-center gap-2 p-2">
        <InputSearch
          id="search-dataset"
          v-model="searchTerm"
          class="flex w-full bg-[#F4F8F9]"
          :show-confirm-button="false"
        />
      </div>
      <div class="relative h-full overflow-y-auto overflow-x-hidden">
        <div
          v-if="mapViewStore.datasetsFetching"
          class="absolute inset-0 flex items-center justify-center transition-all"
        >
          <IconCycle class="animate-spin text-dialog" />
        </div>

        <template v-if="!mapViewStore.datasetsFetching">
          <DatasetSelector
            v-if="searchResults.length > 0"
            :items="searchResults"
            @toggle-dataset="toggleDataset"
          />
          <div
            v-else
            class="flex h-full w-full flex-col items-center justify-center"
          >
            <IconEyeWithLid class="size-20" />
            <p class="p-5 text-center">
              {{ t('datasets.mapView.datasetFilter.noSearchResult') }}
            </p>
          </div>
        </template>
      </div>
    </div>
    <MapViewHint class="rounded" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputSearch from '../../../../../components/input/InputSearch.vue';
import IconCycle from '../../../../../components/svg/IconCycle.vue';
import IconEyeWithLid from '../../../../../components/svg/IconEyeWithLid.vue';
import MapViewHint from '../MapViewHint.vue';
import { useMapViewStore } from '../store/useMapViewStore';
import DatasetSelector from './DatasetSelector.vue';
import { useDatasetSearch } from './useDatasetSearch';
import { useFilterItems } from './useFilterItems';

const { t } = useI18n();

const mapViewStore = useMapViewStore();

const toggleDataset = (datasetId: string) => {
  const selected = mapViewStore.isDatasetSelected(datasetId);
  if (selected) {
    mapViewStore.setSelectedDataset(datasetId, false);
  } else {
    mapViewStore.setSelectedDataset(datasetId, true);
    mapViewStore.fetchRecordsForDatasetId(datasetId);
  }
};

const { filterItems } = useFilterItems();
const { searchTerm, searchResults } = useDatasetSearch(filterItems);
</script>
