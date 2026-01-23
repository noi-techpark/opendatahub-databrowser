<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-center justify-end bg-gray-50 py-2 text-xs">
    <span class="mx-3 block font-semibold text-gray-950">
      {{ props.pagination.pageSize }}
      <span class="text-gray-500">{{ t('datasets.listView.outOf') }}</span>
      {{ props.pagination.totalItems }}
      <span class="text-gray-500 hidden md:inline">{{ t('datasets.listView.areShown') }}</span>
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
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { Pagination } from '../../pagination/types';
import { pageSizeOptions } from './defaultValues';

const { t } = useI18n();

const props = defineProps<{ pagination: Pagination }>();

const { pagination } = toRefs(props);

const { navigation } = storeToRefs(useNavigationStore());

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
