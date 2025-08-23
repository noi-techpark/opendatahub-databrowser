<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex w-full flex-col justify-between gap-6 md:flex-row md:gap-0">
    <span class="grow text-2xl font-semibold text-gray-900">
      {{ isOtherDatasetsLoading ? '...' : visibleDatasetsCount }}
      {{
        !isOtherDatasetsLoading && visibleDatasetsCount === 1
          ? t('overview.listPage.datasetFound')
          : t('overview.listPage.datasetsFound')
      }}
      {{
        searchTerm != null && searchTerm.length !== 0
          ? t('overview.listPage.filtered')
          : ''
      }}
    </span>
    <InputCustom
      v-model="searchTerm"
      :placeholder="t('overview.listPage.searchDataset')"
      type="search"
      input-classes="w-full md:w-64"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCustom from '../../../components/input/InputCustom.vue';

const { t } = useI18n();

defineProps<{
  isOtherDatasetsLoading: boolean;
  visibleDatasetsCount: number;
}>();

const searchTerm = defineModel<string>('searchTerm');
</script>
