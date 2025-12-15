<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBox>
    <ToolBoxSection
      :sectionKey="ToolBoxSectionKey.EXPORTS"
      :title="t('datasets.toolBox.exportDatasets.panelName')"
      :iconComponent="IconDownload"
      info="Scarica i dati in diversi formati"
    >
      <ExportDatasetsToolBoxPanel
        :url="url"
        :references-urls="referencesUrls"
        :withBgColor="false"
      />
    </ToolBoxSection>
    <ToolBoxSection
      :sectionKey="ToolBoxSectionKey.ATTRIBUTES"
      :title="t('datasets.toolBox.attributes.panelName')"
      :iconComponent="IconDownload"
      info="Personalizza la visualizzazione degli attributi"
    >
      <SettingsToolBoxPanel />
    </ToolBoxSection>
  </ToolBox>

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
import {
  ReferenceInfoToolBoxFetchUrlInfo,
  ToolBoxSectionKey,
} from '@/domain/datasets/ui/toolBox/types';
import ToolBoxSection from '@/domain/datasets/ui/toolBox/ToolBoxSection.vue';
import IconDownload from '@/components/svg/IconDownload.vue';
import ColumnConfigurationNavigationGuardHandler
  from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/ColumnConfigurationNavigationGuardHandler.vue';
import {
  provideColumnConfiguration
} from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/columnConfiguration';
import SettingsToolBoxPanel from '@/domain/datasets/ui/detailView/toolBox/SettingsToolBoxPanel.vue';

const { t } = useI18n();

defineProps<{
  url?: string;
  referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
}>();

const { isColumnConfigChanged, isSaveSuccess, discardChanges, saveChanges } =
  provideColumnConfiguration();
</script>
