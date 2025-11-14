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
import { useI18n } from 'vue-i18n';
import SettingsToolBoxPanel from '../../detailView/toolBox/SettingsToolBoxPanel.vue';
import ExportDatasetsToolBoxPanel from '../../toolBox/export/ExportDatasetsToolBoxPanel.vue';
import ToolBox from '../../toolBox/ToolBox.vue';
import { ReferenceInfoToolBoxFetchUrlInfo } from '../../toolBox/types';

const { t } = useI18n();

defineProps<{
  url?: string;
  referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
}>();
</script>
