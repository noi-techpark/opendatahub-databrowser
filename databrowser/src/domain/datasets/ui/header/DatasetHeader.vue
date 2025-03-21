<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="flex flex-wrap items-center gap-2 py-2">
    <!-- Dataset title -->
    <div
      class="flex items-center justify-between"
      :class="[{ 'w-full md:w-64': hasConfig }]"
    >
      <div v-if="hasConfig" class="w-full font-bold text-black">
        <SelectCustom
          extra-button-classes="h-9"
          :grouped-options="selectOptions"
          :value="currentDataset"
          :show-search-when-at-least-count-options="1"
          :size="SelectSize.sm"
          @change="handleDatasetChange"
          @open="handleSelectOpen"
        />
      </div>
      <span v-else class="text-base">
        {{ t('datasets.header.noViewConfig') }}
      </span>
    </div>

    <!-- More info -->
    <DatasetHeaderMoreInfoPopup />

    <!-- Popup -->
    <DatasetHeaderConfigPopup
      :picked="source"
      :class="{
        'animate-pulse rounded outline outline-green-500': !hasConfig,
      }"
      @picked-change="changeSource($event)"
    />

    <DatasetHeaderSearch
      v-if="isTableView"
      :open="inputSearchOpen"
      class="flex md:hidden"
      @open="handleInputSearchOpen"
    />

    <DatasetHeaderOverlay
      :active="inputSearchOpen"
      padded
      @overlay-click="handleInputSearchOpen(false)"
    >
      <InputSearch
        v-if="isTableView"
        id="search-dataset"
        class="md:w-80"
        :show-confirm-button="true"
        :class="[inputSearchOpen ? 'flex' : 'hidden md:flex']"
        :model-value="searchfilter"
        @search="search"
      />
    </DatasetHeaderOverlay>

    <!-- Show information if current view is auto generated -->
    <TagCustom
      v-if="source === 'generated'"
      :text="t('datasets.header.viewGeneratedConfig')"
      size="xs"
      type="yellow"
      has-dot
    />

    <div class="ml-auto flex gap-2">
      <AddRecordButton
        v-if="addRecordSupported"
        class="mr-2 md:flex"
        data-test="desktop-add-record-link"
      />

      <!-- Language picker -->
      <LanguagePicker
        v-if="showLanguagePicker"
        :current-language="currentLanguage"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocationQuery, useRoute, useRouter } from 'vue-router';
import InputSearch from '../../../../components/input/InputSearch.vue';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import SelectCustom from '../../../../components/select/SelectCustom.vue';
import {
  GroupSelectOption,
  SelectSize,
  SelectValue,
} from '../../../../components/select/types';
import TagCustom from '../../../../components/tag/TagCustom.vue';
import { useMetaDataForAllDatasets } from '../../../../pages/datasets/overview/useDatasets';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { getApiDomainFromMetaData } from '../../../metaDataConfig/utils';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { DatasetConfigSource } from '../../config/types';
import { computeTableLocation } from '../../location/datasetViewLocation';
import { computeRouteDomain } from '../../location/routeDomain';
import { computeRoutePath } from '../../location/routePath';
import { useDatasetQueryStore } from '../../location/store/datasetQueryStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import AddRecordButton from './AddRecordButton.vue';
import DatasetHeaderConfigPopup from './DatasetHeaderConfigPopup.vue';
import DatasetHeaderMoreInfoPopup from './DatasetHeaderMoreInfoPopup.vue';
import DatasetHeaderOverlay from './DatasetHeaderOverlay.vue';
import DatasetHeaderSearch from './DatasetHeaderSearch.vue';

const { view, isTableView } = storeToRefs(useDatasetViewStore());

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const { datasetDomain, hasConfig, source } = storeToRefs(
  useDatasetBaseInfoStore()
);

const { metaData } = useMetaDataForAllDatasets();

const relatedDatasetsValues = computed(() => {
  const _view = view.value;

  if (!_view || !('elements' in _view)) return [];

  const _relatedDatasetsValues = [];

  for (const item of _view.elements) {
    if (!('params' in item) || !item.params?.referenceBasePath) {
      continue;
    }

    _relatedDatasetsValues.push(item.params.referenceBasePath);
  }

  return _relatedDatasetsValues;
});

const allDatasetsOptions = computed<GroupSelectOption>(() => {
  return {
    name: 'All datasets',
    options: metaData.value.map((item) => ({
      label: item.shortname,
      value: getDatasetSelectValue(item),
    })),
  };
});

const relatedDatasetsOptions = computed<GroupSelectOption | undefined>(() => {
  if (!relatedDatasetsValues.value?.length) return undefined;

  const _options = allDatasetsOptions.value.options.filter(
    (item) =>
      item.value && relatedDatasetsValues.value.includes(item.value.toString())
  );

  if (!_options.length) return undefined;

  return {
    name: 'Related datasets',
    options: _options,
  };
});

const selectOptions = computed<GroupSelectOption[]>(() => {
  const _options = [allDatasetsOptions.value];

  if (relatedDatasetsOptions.value) {
    _options.unshift(relatedDatasetsOptions.value);
  }

  return _options;
});

const handleInputSearchOpen = (state: boolean) => {
  inputSearchOpen.value = state;
};

const handleSelectOpen = (state: boolean) => {
  selectOpen.value = state;
};

const handleDatasetChange = (value: string) => {
  const dataset = metaData.value.find(
    (item) => getDatasetSelectValue(item) === value
  );

  if (!dataset) return;

  const { pathSegments, apiFilter } = dataset;

  const domain = getApiDomainFromMetaData(dataset);

  router.push(computeTableLocation(domain, pathSegments, apiFilter));
  setCurrentDataset(getDatasetSelectValue(dataset));
};

const currentDataset = ref<SelectValue>('');
const selectOpen = ref<boolean>();
const inputSearchOpen = ref<boolean>();

const searchfilter = useDatasetQueryStore().handle('searchfilter');
const search = (term: string) => {
  const value = term === '' ? undefined : term;
  searchfilter.value = value;
  handleInputSearchOpen(false);
};

const { addRecordSupported } = storeToRefs(useDatasetPermissionStore());

const currentLanguage = useDatasetQueryStore().handle('language');

const changeSource = (value: DatasetConfigSource) => {
  source.value = value;
};

const showLanguagePicker = computed(() => datasetDomain.value === 'tourism');

const getDatasetSelectValue = (dataset: TourismMetaData) => {
  const domain = getApiDomainFromMetaData(dataset);
  const { pathSegments, apiFilter } = dataset;

  return getSelectValue(domain, pathSegments, apiFilter);
};

const getSelectValue = (
  domain: string,
  pathSegments: string[],
  apiFilter: Record<string, string> | LocationQuery
) => {
  const apiFilterSegmentValues = [];
  for (const key in apiFilter) {
    const value = apiFilter[key];
    apiFilterSegmentValues.push(`${key}=${value}`);
  }

  return `/${domain}/${pathSegments.join('/')}${
    apiFilterSegmentValues.length ? '?' + apiFilterSegmentValues.join('&') : ''
  }`;
};

const getClosestMatch = (
  value: string,
  options: string[]
): string | undefined => {
  let closestMatch: string | undefined = undefined;
  let maxMatchLength = 0;

  options.forEach((option) => {
    const matchLength = getCommonPrefixLength(value, option);
    if (matchLength > maxMatchLength) {
      maxMatchLength = matchLength;
      closestMatch = option;
    }
  });

  return closestMatch;
};

const getCommonPrefixLength = (str1: string, str2: string): number => {
  let i = 0;
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++;
  }
  return i;
};

const setCurrentDataset = (dataset: string) => {
  currentDataset.value = dataset;
};

watch(
  () => selectOptions.value,
  (_options) => {
    const allDatasets = _options.at(-1);

    const routeDomain = computeRouteDomain(route);
    const routePath = computeRoutePath(route);

    if (!allDatasets || !routeDomain) return;

    const currentRouteAsSelectValue = getSelectValue(
      routeDomain,
      routePath,
      route.query
    );

    const dataset = getClosestMatch(
      currentRouteAsSelectValue,
      allDatasets.options.map((item) => item.value?.toString() || '')
    );

    if (!dataset) return;

    setCurrentDataset(dataset);
  }
);
</script>
