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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import InputSearch from '../../../../components/input/InputSearch.vue';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import SelectCustom from '../../../../components/select/SelectCustom.vue';
import {
  GroupSelectOption,
  SelectSize,
} from '../../../../components/select/types';
import TagCustom from '../../../../components/tag/TagCustom.vue';
import { useMetaDataForAllDatasets } from '../../../../pages/datasets/overview/useDatasets';
import { useMetaDataStore } from '../../../metaDataConfig/tourism/metaDataStore';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { getApiDomainFromMetaData } from '../../../metaDataConfig/utils';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { DatasetConfigSource } from '../../config/types';
import { computeTableLocation } from '../../location/datasetViewLocation';
import { useDatasetQueryStore } from '../../location/store/datasetQueryStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import AddRecordButton from './AddRecordButton.vue';
import DatasetHeaderConfigPopup from './DatasetHeaderConfigPopup.vue';
import DatasetHeaderMoreInfoPopup from './DatasetHeaderMoreInfoPopup.vue';
import DatasetHeaderOverlay from './DatasetHeaderOverlay.vue';
import DatasetHeaderSearch from './DatasetHeaderSearch.vue';

const { isTableView } = storeToRefs(useDatasetViewStore());

const { t } = useI18n();

const router = useRouter();

const { datasetDomain, hasConfig, source } = storeToRefs(
  useDatasetBaseInfoStore()
);

const { metaData } = useMetaDataForAllDatasets();

const { currentMetaData } = storeToRefs(useMetaDataStore());

const datasetsByParentId = computed(() => {
  const parentDatasets = metaData.value.filter((d) => d.parent == null);
  const childDatasets = metaData.value.filter((d) => d.parent != null);

  const datasetsByParent = parentDatasets.reduce<
    Record<string, TourismMetaData & { children: TourismMetaData[] }>
  >((prev, curr) => {
    prev[curr.id] = {
      ...curr,
      children: childDatasets
        .filter((childDataset) => childDataset.parent?.id === curr.id)
        .sort((a, b) => a.shortname.localeCompare(b.shortname)),
    };
    return prev;
  }, {});

  return Object.values(datasetsByParent).sort((a, b) =>
    a.shortname.localeCompare(b.shortname)
  );
});

// Compute related datasets:
// - if there is a parent for the current dataset, return the parent and all
//   its children (current dataset and siblings)
// - if there is no parent, return all children of the current dataset (possibly empty)
const relatedDatasetsValues = computed(() => {
  if (currentMetaData.value == null) {
    return [];
  }

  // Parent ID is the parent of the current dataset, or the current dataset itself
  const parentId = currentMetaData.value.parent?.id ?? currentMetaData.value.id;

  // Find the parent dataset
  const parent = datasetsByParentId.value.find((d) => d.id === parentId);

  // The parent dataset should never be null, but we handle the case just in case
  if (parent == null) {
    return [];
  }

  const parentSelectValues = getDatasetSelectValue(parent);
  const childrenSelectValues = parent.children.map((child) =>
    getDatasetSelectValue(child)
  );

  return [parentSelectValues, ...childrenSelectValues];
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
  if (relatedDatasetsValues.value.length === 0) {
    return undefined;
  }

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

const handleDatasetChange = (value: string) => {
  const [path, query] = value.split('?');

  if (path == null) {
    return;
  }

  const pathParts = path.split('/');

  if (pathParts.length < 3) {
    return;
  }

  const domain = pathParts[1];
  const pathSegments = pathParts.slice(2);
  const apiFilter = Object.fromEntries(
    query?.split('&').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    })
  );

  router.push(computeTableLocation(domain, pathSegments, apiFilter));
};

const currentDataset = computed<string | undefined>(() => {
  if (currentMetaData.value == null) {
    return undefined;
  }

  return getDatasetSelectValue(currentMetaData.value);
});

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

  // transform apiFilter (record) to array of key/value pairs to object
  const query = Object.entries(apiFilter).map(
    ([key, value]) => `${key}=${value}`
  );

  return `/${domain}/${pathSegments.join('/')}${
    query.length ? '?' + query.join('&') : ''
  }`;
};
</script>
