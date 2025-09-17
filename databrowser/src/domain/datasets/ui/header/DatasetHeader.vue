<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="flex flex-wrap items-center gap-2 py-1">
    <!-- Dataset title -->
    <DatasetHeaderSelectDataset :has-config="hasConfig" />

    <!-- More info -->
    <DatasetHeaderMoreInfoPopup />

    <!-- TODO valutare se serve ancora questo -->
    <!-- Popup -->
<!--    <DatasetHeaderConfigPopup-->
<!--      :model-value="source"-->
<!--      :class="{-->
<!--        'animate-pulse rounded outline outline-green-500': !hasConfig,-->
<!--      }"-->
<!--      @update:model-value="changeSource($event)"-->
<!--    />-->

    <DatasetHeaderSearch
      :disabled="!isTableView"
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
        :disabled="!isTableView"
        id="search-dataset"
        class="md:w-80"
        :show-confirm-button="true"
        :class="[inputSearchOpen ? 'flex' : 'hidden md:flex']"
        :model-value="searchfilter"
        @search="search"
      />
    </DatasetHeaderOverlay>


    <!-- filters button -->
    <DatasetHeaderButton
      :disabled="!isTableView"
      :handler="()=>{ openToolBoxHandler(ToolBoxSectionKey.FILTERS) }"
      label="Filters"
      :icon="OdhFilter"
      :active="isToolBoxActive(ToolBoxSectionKey.FILTERS)"
      :has-bullet="hasActiveFilters()"
    />

    <!-- Language picker -->
    <LanguagePicker
        v-if="showLanguagePicker"
        :current-language="currentLanguage"
        @language-changed="changeLanguage"
    />

    <!-- view button -->
    <ViewPicker
        v-if="showViewPicker"
        :picked="source"
        @picked-change="changeSource($event)"
    />

    <!-- attributes button -->
    <DatasetHeaderButton
        :handler="()=>{ openToolBoxHandler(ToolBoxSectionKey.ATTRIBUTES) }"
        label="Attributes"
        :disabled="true"
        :icon="OdhAttributes"
        :active="isToolBoxActive(ToolBoxSectionKey.ATTRIBUTES)"
    />


    <!-- Show information if current view is auto generated -->
    <TagCustom
      v-if="source === 'generated'"
      :text="t('datasets.header.viewGeneratedConfig')"
      size="xs"
      type="yellow"
      has-dot
    />

    <div class="ml-auto flex">
      <AddRecordButton
        v-if="addRecordSupported"
        class="mr-2 md:flex"
        data-test="desktop-add-record-link"
      />

      <!-- export button -->
      <DatasetHeaderButton
          :handler="()=>{ openToolBoxHandler(ToolBoxSectionKey.EXPORTS) }"
          label="Export"
          :icon="OdhExport"
          :active="isToolBoxActive(ToolBoxSectionKey.EXPORTS)"
      />
<!-- TODO portare in attributes-->
<!--      <DatasetHeaderButton-->
<!--          :handler="()=>{ openToolBoxHandler(ToolBoxSectionKey.SETTINGS) }"-->
<!--          label="Settings"-->
<!--          :icon="OdhExport"-->
<!--          :active="isToolBoxActive(ToolBoxSectionKey.SETTINGS)"-->
<!--      />-->



    </div>

    <!-- actions button -->
    <DatasetHeaderButton
        :handler="()=>{ openToolBoxHandler(ToolBoxSectionKey.ACTIONS) }"
        label="Actions"
        :icon="OdhActions"
        :active="isToolBoxActive(ToolBoxSectionKey.ACTIONS)"
    />
    <!-- Popup -->
  <!-- TODO: Rimosso, resta da portare il show deprecated fields -->
<!--    <DatasetHeaderConfigPopup-->
<!--        :picked="source"-->
<!--        :class="{-->
<!--        'animate-pulse rounded outline outline-green-500': !hasConfig,-->
<!--      }"-->
<!--        @picked-change="changeSource($event)"-->
<!--    />-->
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InputSearch from '../../../../components/input/InputSearch.vue';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import TagCustom from '../../../../components/tag/TagCustom.vue';
import { useUserSettings } from '../../../user/userSettings';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { DatasetConfigSource } from '../../config/types';
import { useDatasetQueryStore } from '../../location/store/datasetQueryStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import AddRecordButton from './AddRecordButton.vue';
// import DatasetHeaderConfigPopup from './DatasetHeaderConfigPopup.vue';
import DatasetHeaderMoreInfoPopup from './DatasetHeaderMoreInfoPopup.vue';
import DatasetHeaderOverlay from './DatasetHeaderOverlay.vue';
import DatasetHeaderSearch from './DatasetHeaderSearch.vue';
import DatasetHeaderSelectDataset from './DatasetHeaderSelectDataset.vue';
import DatasetHeaderButton from './DatasetHeaderButton.vue';
import { useToolBoxStore } from '../toolBox/toolBoxStore';
import {ToolBoxSectionKey} from "@/domain/datasets/ui/toolBox/types.ts";
import ViewPicker from "@/components/view/ViewPicker.vue";
import {useTableFilterStore} from "@/domain/datasets/ui/tableView/filter/tableFilterStore.ts";
import OdhFilter from "@/components/svg/odh/OdhFilter.vue";
import OdhAttributes from "@/components/svg/odh/OdhAttributes.vue";
import OdhActions from "@/components/svg/odh/OdhActions.vue";
import OdhExport from "@/components/svg/odh/OdhExport.vue";

const toolBoxStore = useToolBoxStore();
const tableFilterStore = useTableFilterStore();

const { isTableView } = storeToRefs(useDatasetViewStore());

const { t } = useI18n();

const { datasetDomain, hasConfig } = storeToRefs(useDatasetBaseInfoStore());

const inputSearchOpen = ref<boolean>();

const handleInputSearchOpen = (state: boolean) => {
  inputSearchOpen.value = state;
};

const searchfilter = useDatasetQueryStore().handle('searchfilter');
const search = (term: string) => {
  searchfilter.value = term === '' ? undefined : term;
  handleInputSearchOpen(false);
};

const { addRecordSupported } = storeToRefs(useDatasetPermissionStore());

const currentLanguage = useDatasetQueryStore().handle('language');

const showLanguagePicker = computed(() => datasetDomain.value === 'tourism');
const showViewPicker = computed(() => true);

const { getUserSetting, updateUserSetting } = useUserSettings();

const source = ref(getUserSetting('preferredDatasetSource'));
watch(
  () => getUserSetting('preferredDatasetSource'),
  (newValue) => (source.value = newValue)
);

const changeSource = async (value: DatasetConfigSource) => {
  const oldSourceValue = getUserSetting('preferredDatasetSource');
  // Try to update user setting, but it may fail due to guards
  const isUpdateSuccessful = await updateUserSetting(
    'preferredDatasetSource',
    value
  );
  // If it failed, revert the local value
  if (!isUpdateSuccessful) {
    source.value = oldSourceValue;
  }
};

const changeLanguage = (value: string) => {
  updateUserSetting('preferredDatasetLanguage', value);
};


const hasActiveFilters = () => {
  return tableFilterStore.tableFilters.length > 0;
};


const isToolBoxActive = (sectionKey:ToolBoxSectionKey) => {
  return toolBoxStore.activeSectionKey === sectionKey;
};

const openToolBoxHandler = (sectionKey:ToolBoxSectionKey) => {
  toolBoxStore.toggleToolBoxSectionKey(sectionKey);
};

</script>
