<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox
    :tab-names="[
      t('datasets.listView.toolBox.searchAndFilter.panelName'),
      t('datasets.toolBox.exportDatasets.panelName'),
      t('datasets.listView.toolBox.userTableAttributes.panelName'),
    ]"
    :default-index="2"
  >
    <SearchAndFilterToolBoxPanel />
    <ExportDatasetsToolBoxPanel :url="url" />
    <UserTableSettingsToolBoxPanel />
  </ToolBox>

  <ColumnConfigurationSaveGuardDialog
    :has-unsaved-changes="isColumnConfigChanged"
    :is-save-success="isSaveSuccess"
    @discard-changes="discardChanges"
    @saveChanges="saveChanges"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExportDatasetsToolBoxPanel from '../../toolBox/export/ExportDatasetsToolBoxPanel.vue';
import ToolBox from '../../toolBox/ToolBox.vue';
import { provideColumnConfiguration } from './configureTableColumns/columnConfiguration';
import ColumnConfigurationSaveGuardDialog from './configureTableColumns/ColumnConfigurationSaveGuardDialog.vue';
import SearchAndFilterToolBoxPanel from './SearchAndFilterToolBoxPanel.vue';
import UserTableSettingsToolBoxPanel from './UserTableSettingsToolBoxPanel.vue';

const { t } = useI18n();

defineProps<{ url?: string }>();

const { isColumnConfigChanged, isSaveSuccess, discardChanges, saveChanges } =
  provideColumnConfiguration();
</script>
