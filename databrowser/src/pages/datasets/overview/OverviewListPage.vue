<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <AppLayout>
    <OverviewListPageHero />

    <PageGridContent v-if="!mapVisible" class="grow gap-3 lg:gap-3">
      <div class="flex w-full flex-col items-start gap-2 md:flex-row md:gap-10">
        <!-- Mobile search -->
        <OverviewListSearch
          v-model:search-term="searchTerm"
          :is-other-datasets-loading="isMetaDataLoading"
          :visible-datasets-count="filteredMetaData.length"
          class="md:hidden"
        />

        <!-- Mobile map button -->
        <ButtonCustom
          :size="Size.xm2col"
          class="flex items-center justify-center gap-2 uppercase md:hidden"
          @click="showMap()"
        >
          <IconLocationOn />
          {{ t('overview.listPage.showOnMap') }}
        </ButtonCustom>

        <!-- Mobile filters button -->
        <button
          class="flex w-full shrink-0 items-center gap-2 rounded border border-gray-300 px-3 py-2 font-semibold text-green-400 md:hidden"
          @click="showFilters"
        >
          <div class="grow">
            {{ t('overview.listPage.showFilters') }}
          </div>
          <div
            v-if="appliedFiltersNum"
            class="rounded bg-gray-200 px-2 text-sm text-gray-900"
          >
            {{ appliedFiltersNum }}
          </div>
          <IconFilter class="mr-2 size-3" />
        </button>

        <div class="flex flex-col gap-3">
          <!-- Desktop map button -->
          <div
            class="hidden shrink-0 items-center justify-center bg-auto md:flex md:w-64 md:bg-[url('/map-black-white.jpg')]"
          >
            <ButtonCustom
              class="flex items-center justify-center gap-2 uppercase md:my-16"
              :size="Size.xm2col"
              @click="showMap()"
            >
              <IconLocationOn />
              {{ t('overview.listPage.showOnMap') }}
            </ButtonCustom>
          </div>

          <!-- Filters -->
          <div
            class="fixed inset-0 w-full shrink-0 rounded border border-gray-300 bg-white pb-3 md:relative md:block md:w-64"
            :class="{
              hidden: !isFiltersModalVisible,
            }"
          >
            <!-- Filters list -->
            <OverviewListFilter />

            <!-- Action buttons -->
            <div
              class="fixed bottom-0 flex w-full gap-3 border-t border-gray-300 bg-white px-3 py-4 md:relative md:w-auto md:py-3 md:pb-0"
            >
              <ResetAllFilters
                class="flex flex-1 items-center justify-center text-sm"
                @reset-all-filters="resetAllFilters"
              />
              <button
                class="flex flex-1 cursor-pointer select-none items-center justify-center gap-1 rounded border border-gray-300 bg-green-400 py-1 text-sm text-white md:hidden"
                @click="hideFilters"
              >
                {{ t('overview.listPage.applyFilters') }}
              </button>
            </div>
          </div>
        </div>

        <div class="w-full">
          <OverviewListSearch
            v-model:search-term="searchTerm"
            class="mb-3 hidden md:flex"
            :is-other-datasets-loading="isMetaDataLoading"
            :visible-datasets-count="filteredMetaData.length"
          />
          <div class="flex min-h-screen flex-col gap-4">
            <div v-if="isMetaDataLoading" class="animate-pulse">
              {{ t('overview.listPage.loadOtherDatasets') }}
            </div>
            <template v-else>
              <OverviewCardItem
                v-for="(dataset, index) in filteredMetaData"
                :key="index"
                :dataset="dataset"
                :data-test="`dataset-card-${dataset.id}`"
                class="break-words"
              />
              <div
                v-if="filteredMetaData.length === 0"
                class="flex items-center justify-center rounded border border-gray-300 p-3"
              >
                {{ t('overview.listPage.noDatasetFoundWithSelectedFilters') }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <CardDivider />

      <PartnersAndContributors />
    </PageGridContent>

    <MapViewAsDialog v-if="mapVisible" @close="hideMap" />
  </AppLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ButtonCustom from '../../../components/button/ButtonCustom.vue';
import { Size } from '../../../components/button/types';
import CardDivider from '../../../components/card/CardDivider.vue';
import PageGridContent from '../../../components/content/PageGridContent.vue';
import PartnersAndContributors from '../../../components/partners/PartnersAndContributors.vue';
import IconFilter from '../../../components/svg/IconFilter.vue';
import IconLocationOn from '../../../components/svg/IconLocationOn.vue';
import MapViewAsDialog from '../../../domain/datasets/ui/mapView/MapViewAsDialog.vue';
import ResetAllFilters from '../../../domain/datasets/ui/tableView/filter/ResetAllFilters.vue';
import AppLayout from '../../../layouts/AppLayout.vue';
import OverviewCardItem from './OverviewCardItem.vue';
import OverviewListFilter from './OverviewListFilter.vue';
import OverviewListPageHero from './OverviewListPageHero.vue';
import OverviewListSearch from './OverviewListSearch.vue';
import { useOverviewListStore } from './overviewListStore';

const { t } = useI18n();

const router = useRouter();

const showMap = () =>
  router.push({ query: { ...router.currentRoute.value.query, map: 'true' } });

const hideMap = () =>
  router.push({
    query: { ...router.currentRoute.value.query, map: undefined },
  });

const mapVisible = computed(
  () => router.currentRoute.value.query.map === 'true'
);

const { isMetaDataLoading, searchTerm, filters, filteredMetaData } =
  storeToRefs(useOverviewListStore());

const { resetAllFilters } = useOverviewListStore();

const isFiltersModalVisible = ref(false);

const showFilters = () => {
  isFiltersModalVisible.value = true;
};

const hideFilters = () => {
  isFiltersModalVisible.value = false;
};

const appliedFiltersNum = computed(() => {
  return filters.value.size;
});
</script>
