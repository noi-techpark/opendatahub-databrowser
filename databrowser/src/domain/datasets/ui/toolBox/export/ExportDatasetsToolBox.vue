<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox
    :tab-names="[t('datasets.toolBox.exportDatasets.panelName')]"
    :open-tool-box-button-label="
      useCustomButtonLabels ? t('datasets.toolBox.button.openToolBox') : ''
    "
    :close-tool-box-button-label="
      useCustomButtonLabels ? t('datasets.toolBox.button.closeToolBox') : ''
    "
  >
    <ExportDatasetsToolBoxPanel :url="url" />
  </ToolBox>
</template>

<script setup lang="ts">
import ToolBox from '../ToolBox.vue';
import ExportDatasetsToolBoxPanel from './ExportDatasetsToolBoxPanel.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{ url?: string; useCustomButtonLabels?: boolean }>();
</script>
