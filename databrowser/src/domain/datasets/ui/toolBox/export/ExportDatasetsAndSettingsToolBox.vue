<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox
    :tab-names="[
      t('datasets.toolBox.exportDatasets.panelName'),
      t('datasets.toolBox.exportDatasets.settings'),
    ]"
    :open-tool-box-button-label="t('datasets.toolBox.button.openToolBox')"
    :close-tool-box-button-label="t('datasets.toolBox.button.closeToolBox')"
  >
    <ExportDatasetsToolBoxPanel
      :url="url"
      :references-urls="referencesUrls"
      :with-bg-color="false"
    />
    <SettingsToolBoxPanel />
  </ToolBox>
</template>

<script setup lang="ts">
import ToolBox from '../ToolBox.vue';
import ExportDatasetsToolBoxPanel from './ExportDatasetsToolBoxPanel.vue';
import SettingsToolBoxPanel from '../SettingsToolBoxPanel.vue';
import { useI18n } from 'vue-i18n';
import { ReferenceInfoToolBoxFetchUrlInfo } from '../types';

const { t } = useI18n();

defineProps<{
  url?: string;
  referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
}>();
</script>
