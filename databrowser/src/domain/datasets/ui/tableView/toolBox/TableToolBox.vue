<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox
    :tab-names="[
      t('datasets.listView.toolBox.searchAndFilter.panelName'),
      t('datasets.toolBox.exportDatasets.panelName'),
    ]"
  >
    <SearchAndFilterToolBoxPanel />
    <ExportDatasetsToolBoxPanel :url="url" />
  </ToolBox>
  <div></div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExportDatasetsToolBoxPanel from '../../toolBox/export/ExportDatasetsToolBoxPanel.vue';
import ToolBox from '../../toolBox/ToolBox.vue';
import SearchAndFilterToolBoxPanel from './SearchAndFilterToolBoxPanel.vue';

const { t } = useI18n();

defineProps<{ url?: string }>();
</script>
