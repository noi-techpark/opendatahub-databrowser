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
    >
      <ExportDatasetsToolBoxPanel :url="url" />
    </ToolBoxSection>

    <ToolBoxSection
      :sectionKey="ToolBoxSectionKey.ATTRIBUTES"
      :title="t('datasets.toolBox.attributes.panelName')"
      :iconComponent="OdhAttributes"
    >
      <ColumnConfigurator />
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
import { provideColumnConfiguration } from './configureTableColumns/columnConfiguration';
import ColumnConfigurationNavigationGuardHandler from './configureTableColumns/ColumnConfigurationNavigationGuardHandler.vue';
import SearchAndFilterToolBoxPanel from './SearchAndFilterToolBoxPanel.vue';
import { ToolBoxSectionKey } from '@/domain/datasets/ui/toolBox/types';
import ToolBoxSection from "@/domain/datasets/ui/toolBox/ToolBoxSection.vue";
import IconFilter from "@/components/svg/IconFilter.vue";
import InfoFilter from "@/domain/datasets/ui/tableView/toolBox/InfoFilter.vue";
import {Pagination} from "@/domain/datasets/pagination/types";
import IconDownload from "@/components/svg/IconDownload.vue";
import OdhAttributes from '@/components/svg/odh/OdhAttributes.vue';
import ColumnConfigurator from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/ColumnConfigurator.vue';

const { t } = useI18n();

defineProps<{
  url?: string,
  pagination: Pagination
}>();

const { isColumnConfigChanged, isSaveSuccess, discardChanges, saveChanges } =
  provideColumnConfiguration();
</script>
