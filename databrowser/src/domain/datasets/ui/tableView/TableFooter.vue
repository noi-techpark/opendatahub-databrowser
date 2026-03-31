<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-center justify-end bg-gray-50 py-2 text-xs">
    <span class="mx-3 block font-semibold text-gray-950">
      {{ firstRecord }} - {{ lastRecord }}
      <span class="text-gray-500"> {{ t('datasets.listView.outOf') }}&nbsp;</span>
      <span>{{ metaDataTotalCount ?? '-' }}</span>
      <span class="text-gray-500 hidden md:inline">&nbsp;{{ t('datasets.listView.areShown') }}</span>
    </span>
    <SelectCustom
      id="dataset-table-page-size"
      class="mr-2 w-16"
      :options="options"
      :model-value="pagination.pageSize.toString()"
      :show-value-as-label-fallback="true"
      :size="SelectSize.sm"
      @update:model-value="navigation.changePageSize(Number($event))"
    />
    <span class="mr-3 hidden md:inline">{{ t('datasets.listView.perPage') }}</span>
    <span class="mr-3 block md:hidden">{{ t('datasets.listView.pp') }}</span>
    <Paginator
      v-if="pagination.hasPagination"
      id="dataset-table-paginator"
      :pagination="pagination"
      :navigation="navigation"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import Paginator from '@/components/paginator/Paginator.vue';
import SelectCustom from '@/components/select/SelectCustom.vue';
import { SelectSize } from '@/components/select/types';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { Pagination } from '../../pagination/types';
import { useMetaDataForRoute } from '@/domain/metaDataConfig/tourism/useMetaData';
import { pageSizeOptions } from './defaultValues';

const { t } = useI18n();

const props = defineProps<{ pagination: Pagination }>();

const { pagination } = toRefs(props);

const { navigation } = storeToRefs(useNavigationStore());

const { datasetPath, datasetQuery } = storeToRefs(useDatasetBaseInfoStore());
const { currentMetaData } = useMetaDataForRoute(datasetPath, datasetQuery);


const metaDataTotalCount = computed(() => {
  const rc = currentMetaData.value?.recordCount;
  return Math.max(props.pagination.totalItems,rc.Total ?? 0);
});

const firstRecord = computed(() => {
  const { currentPage, pageSize } = pagination.value;
  return (currentPage - 1) * pageSize + 1;
});

const lastRecord = computed(() => {
  const { currentPage, pageSize, totalItems } = pagination.value;
  return Math.min(currentPage * pageSize, totalItems);
});

const options = computed(() => {
  if (pagination.value.hasPagination) {
    return pageSizeOptions;
  }
  // If there is no pagination, show the total number of items
  // as the select only option.
  return [
    {
      value: pagination.value.totalItems.toString(),
      label: pagination.value.totalItems.toString(),
    },
  ];
});
</script>
