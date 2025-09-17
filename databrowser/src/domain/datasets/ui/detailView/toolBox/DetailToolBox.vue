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
      :sectionKey="ToolBoxSectionKey.SETTINGS"
      :title="t('datasets.toolBox.exportDatasets.panelName')"
      :iconComponent="IconDownload"
      info="Scarica i   dati in diversi formati"
    >
<!--      <SettingsToolBoxPanel />-->
      <div class="flex flex-col gap-3">
        <ShowEmptyFields custom-text-classes="font-semibold" has-description />
        <ShowDeprecatedFields
          custom-text-classes="font-semibold"
          has-description
        />
        <ShowReferencesFields
          custom-text-classes="font-semibold"
          has-description
        />
      </div>
    </ToolBoxSection>
  </ToolBox>
  <div></div>
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
import ShowDeprecatedFields from '@/domain/datasets/ui/common/showDeprecatedFields/ShowDeprecatedFields.vue';
import ShowEmptyFields from '@/domain/datasets/ui/common/showEmptyFields/ShowEmptyFields.vue';
import ShowReferencesFields from '@/domain/datasets/ui/common/showReferencesFields/ShowReferencesFields.vue';

const { t } = useI18n();

defineProps<{
  url?: string;
  referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
}>();
</script>
