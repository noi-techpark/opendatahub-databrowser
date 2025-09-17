<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox>
    <ToolBoxSection
      :sectionKey="ToolBoxSectionKey.FILTERS"
      :title="t('datasets.listView.toolBox.searchAndFilter.panelName')"
      :iconComponent="IconFilter"
      :infoComponent="InfoFilter"
    >
      <SearchAndFilterToolBoxPanel :pagination="pagination" />
    </ToolBoxSection>

    <ToolBoxSection
      :sectionKey="ToolBoxSectionKey.EXPORTS"
      :title="t('datasets.toolBox.exportDatasets.panelName')"
      :iconComponent="IconDownload"
      info="Scarica i dati in diversi formati"
    >
      <ExportDatasetsToolBoxPanel :url="url" :withBgColor="false" />
    </ToolBoxSection>
  </ToolBox>

  <!-- TODO : vedi sotto la parte di gapp -->
<!--  <ToolBox-->
<!--    :tab-names="[-->
<!--      t('datasets.listView.toolBox.searchAndFilter.panelName'),-->
<!--      t('datasets.toolBox.exportDatasets.panelName'),-->
<!--      t('datasets.listView.toolBox.userTableAttributes.panelName'),-->
<!--    ]"-->
<!--  >-->
<!--    <SearchAndFilterToolBoxPanel :pagination="pagination" />-->
<!--    <ExportDatasetsToolBoxPanel :url="url" />-->
<!--    <UserTableSettingsToolBoxPanel />-->
<!--  </ToolBox>-->

  <ColumnConfigurationNavigationGuardHandler
    :has-unsaved-changes="isColumnConfigChanged"
    :is-save-success="isSaveSuccess"
    @discard-changes="discardChanges"
    @save-changes="saveChanges"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExportDatasetsToolBoxPanel from '../../toolBox/export/ExportDatasetsToolBoxPanel.vue';
import ToolBox from '../../toolBox/ToolBox.vue';
import { provideColumnConfiguration } from './configureTableColumns/columnConfiguration';
import ColumnConfigurationNavigationGuardHandler from './configureTableColumns/ColumnConfigurationNavigationGuardHandler.vue';
import SearchAndFilterToolBoxPanel from './SearchAndFilterToolBoxPanel.vue';
// import UserTableSettingsToolBoxPanel from './UserTableSettingsToolBoxPanel.vue';
import { ToolBoxSectionKey } from '@/domain/datasets/ui/toolBox/types.ts';
import ToolBoxSection from "@/domain/datasets/ui/toolBox/ToolBoxSection.vue";
import IconFilter from "@/components/svg/IconFilter.vue";
import InfoFilter from "@/domain/datasets/ui/tableView/toolBox/InfoFilter.vue";
import {Pagination} from "@/domain/datasets/pagination/types.ts";
import IconDownload from "@/components/svg/IconDownload.vue";

const { t } = useI18n();

defineProps<{
  url?: string,
  pagination: Pagination
}>();

const { isColumnConfigChanged, isSaveSuccess, discardChanges, saveChanges } =
  provideColumnConfiguration();
</script>
