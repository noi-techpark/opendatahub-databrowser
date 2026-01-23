<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex items-center justify-between"
    :class="[{ 'w-full md:w-64': hasConfig }]"
  >
    <div v-if="hasConfig" class="w-full font-bold text-black">
      <SelectCustom
        extra-button-classes="h-11 border-lightgray rounded"
        :model-value="currentDatasetName"
        :grouped-options="selectOptions"
        :show-search-when-at-least-count-options="1"
        :size="SelectSize.sm"
        :show-value-as-label-fallback="true"
        @update:model-value="handleDatasetChange"
      />
    </div>

    <span v-else class="text-base">
      {{ t('datasets.header.noViewConfig') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import SelectCustom from '@/components/select/SelectCustom.vue';
import {
  GroupSelectOption,
  SelectSize,
  SelectValue,
} from '@/components/select/types';
import { useMetaDataForAllDatasets } from '@/pages/datasets/overview/useDatasets';
import { useMetaDataStore } from '../../../metaDataConfig/tourism/metaDataStore';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { getApiDomainFromMetaData } from '../../../metaDataConfig/utils';
import { computeTableLocation } from '../../location/datasetViewLocation';

const { t } = useI18n();

defineProps<{ hasConfig: boolean }>();

const router = useRouter();

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

const allDatasetsOptions = computed<GroupSelectOption>(() => {
  return {
    name: 'All datasets',
    options: metaData.value.map((item) => ({
      label: item.shortname,
      value: getDatasetSelectValue(item),
    })),
  };
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

const relatedDatasetsOptions = computed<GroupSelectOption | undefined>(() => {
  if (relatedDatasetsValues.value.length === 0) {
    return undefined;
  }

  const options = allDatasetsOptions.value.options.filter(
    (item) =>
      item.value && relatedDatasetsValues.value.includes(item.value.toString())
  );

  if (options.length === 0) {
    return undefined;
  }

  return {
    name: 'Related datasets',
    options,
  };
});

const selectOptions = computed<GroupSelectOption[]>(() => {
  return relatedDatasetsOptions.value != null
    ? [relatedDatasetsOptions.value, allDatasetsOptions.value]
    : [allDatasetsOptions.value];
});

const handleDatasetChange = (value: SelectValue | undefined) => {
  const [path, query] = String(value).split('?');

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
    (query ?? '').split('&').map((part) => {
      const [key, value] = part.split('=');
      return [key, value];
    })
  );

  router.push(computeTableLocation(domain, pathSegments, apiFilter));
};

const currentDatasetName = computed<string | undefined>(() => {
  // If the current dataset is known return its select value
  // such that the select shows the correct value
  if (currentMetaData.value != null) {
    return getDatasetSelectValue(currentMetaData.value);
  }

  // If the current dataset is not known, we try to generate
  // the select value from the current route
  const route = router.currentRoute.value;
  if (Array.isArray(route.params.pathSegments)) {
    return `/${route.params.pathSegments.join('/')}`;
  }

  return route.params.pathSegments;
});

const getDatasetSelectValue = (dataset: TourismMetaData) => {
  const domain = getApiDomainFromMetaData(dataset);
  const { pathSegments, apiFilter } = dataset;

  const query = Object.entries(apiFilter).map(
    ([key, value]) => `${key}=${value}`
  );

  const language = router.currentRoute.value.query.language;
  if (language != null) {
    query.push(`language=${language}`);
  }

  return `/${domain}/${pathSegments.join('/')}${
    query.length ? '?' + query.join('&') : ''
  }`;
};
</script>
