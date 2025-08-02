<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="flex flex-wrap items-center gap-2 py-2">
    <!-- Dataset title -->
    <DatasetHeaderSelectDataset :has-config="hasConfig" />

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
        @language-changed="changeLanguage"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputSearch from '../../../../components/input/InputSearch.vue';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import TagCustom from '../../../../components/tag/TagCustom.vue';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { DatasetConfigSource } from '../../config/types';
import { useDatasetQueryStore } from '../../location/store/datasetQueryStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import AddRecordButton from './AddRecordButton.vue';
import DatasetHeaderConfigPopup from './DatasetHeaderConfigPopup.vue';
import DatasetHeaderMoreInfoPopup from './DatasetHeaderMoreInfoPopup.vue';
import DatasetHeaderOverlay from './DatasetHeaderOverlay.vue';
import DatasetHeaderSearch from './DatasetHeaderSearch.vue';
import DatasetHeaderSelectDataset from './DatasetHeaderSelectDataset.vue';

const { isTableView } = storeToRefs(useDatasetViewStore());

const { t } = useI18n();

const { datasetDomain, hasConfig, source } = storeToRefs(
  useDatasetBaseInfoStore()
);

const inputSearchOpen = ref<boolean>();

const handleInputSearchOpen = (state: boolean) => {
  inputSearchOpen.value = state;
};

const searchfilter = useDatasetQueryStore().handle('searchfilter');
const search = (term: string) => {
  const value = term === '' ? undefined : term;
  searchfilter.value = value;
  handleInputSearchOpen(false);
};

const { addRecordSupported } = storeToRefs(useDatasetPermissionStore());

const currentLanguage = useDatasetQueryStore().handle('language');

const showLanguagePicker = computed(() => datasetDomain.value === 'tourism');

const changeSource = (value: DatasetConfigSource) => {
  useLocalStorage<DatasetConfigSource>('preferredDatasetSource', value).value =
    value;
};

const changeLanguage = (value: string) => {
  useLocalStorage<string>('preferredDatasetLanguage', value).value = value;
};
</script>
