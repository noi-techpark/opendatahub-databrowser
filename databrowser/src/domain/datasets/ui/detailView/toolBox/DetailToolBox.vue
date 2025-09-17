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
      <UserTableSettingsToolBoxPanel />
      <!-- TODO: I FIELDS SOTTO NON DOVREBBERO ESSERE TUTTI DENTRO AL UserTableSettingsToolBoxPanel? -->
<!--      <div class="flex flex-col gap-3">-->
<!--        <ShowEmptyFields custom-text-classes="font-semibold" has-description />-->
<!--        <ShowDeprecatedFields-->
<!--          custom-text-classes="font-semibold"-->
<!--          has-description-->
<!--        />-->
<!--        <ShowReferencesFields-->
<!--          custom-text-classes="font-semibold"-->
<!--          has-description-->
<!--        />-->
<!--      </div>-->

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
} from '@/domain/datasets/ui/toolBox/types.ts';
import ToolBoxSection from '@/domain/datasets/ui/toolBox/ToolBoxSection.vue';
import IconDownload from '@/components/svg/IconDownload.vue';
// import ShowDeprecatedFields from '@/domain/datasets/ui/common/showDeprecatedFields/ShowDeprecatedFields.vue';
// import ShowEmptyFields from '@/domain/datasets/ui/common/showEmptyFields/ShowEmptyFields.vue';
// import ShowReferencesFields from '@/domain/datasets/ui/common/showReferencesFields/ShowReferencesFields.vue';
import UserTableSettingsToolBoxPanel from '@/domain/datasets/ui/tableView/toolBox/UserTableSettingsToolBoxPanel.vue';
import ColumnConfigurationNavigationGuardHandler
  from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/ColumnConfigurationNavigationGuardHandler.vue';
import {
  provideColumnConfiguration
} from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/columnConfiguration.ts';

const { t } = useI18n();

defineProps<{
  url?: string;
  referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
}>();

const { isColumnConfigChanged, isSaveSuccess, discardChanges, saveChanges } =
  provideColumnConfiguration();
</script>
