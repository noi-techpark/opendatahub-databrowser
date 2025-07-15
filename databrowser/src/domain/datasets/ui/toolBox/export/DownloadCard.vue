<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxCard>
    <ToolBoxCardHeader>
      {{ t('datasets.toolBox.exportDatasets.download.header') }}
      <ToolBoxCardHeaderButton
        :aria-label="t('datasets.toolBox.exportDatasets.download.iconAlt')"
      >
      </ToolBoxCardHeaderButton>
    </ToolBoxCardHeader>
    <ToolBoxCardBody>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <ToggleCustom v-model="isDownloadCSV" />
          <div class="flex flex-col text-xs">
            <span class="font-bold">
              {{ t('datasets.toolBox.exportDatasets.download.csv.header') }}
            </span>
            <span>
              {{ t('datasets.toolBox.exportDatasets.download.csv.body') }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <ToggleCustom v-model="isDownloadJson"></ToggleCustom>
          <div class="flex flex-col text-xs">
            <span class="font-bold">
              {{ t('datasets.toolBox.exportDatasets.download.json.header') }}
            </span>
            <span>
              {{ t('datasets.toolBox.exportDatasets.download.json.body') }}
            </span>
          </div>
        </div>
      </div>
      <ButtonCustom
        class="mt-4 flex items-center gap-3 px-2 py-1.5 text-sm"
        :size="Size.xs"
        :aria-label="t('datasets.toolBox.exportDatasets.download.buttonAlt')"
        @click="download"
      >
        <IconDownload class="size-4" />
        {{ t('datasets.toolBox.exportDatasets.download.button') }}
      </ButtonCustom>

      <pre>{{ downloads }}</pre>
    </ToolBoxCardBody>
  </ToolBoxCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../components/button/types';
import IconDownload from '../../../../../components/svg/IconDownload.vue';
import ToggleCustom from '../../../../../components/toggle/ToggleCustom.vue';
import { useDownloadStore } from '../../../../download/downloadStore';
import ToolBoxCard from '../ToolBoxCard.vue';
import ToolBoxCardBody from '../ToolBoxCardBody.vue';
import ToolBoxCardHeader from '../ToolBoxCardHeader.vue';
import ToolBoxCardHeaderButton from '../ToolBoxCardHeaderButton.vue';

const { t } = useI18n();

const props = defineProps<{
  url: string;
}>();

const { url } = toRefs(props);

const isDownloadJson = ref(false);
const isDownloadCSV = ref(true);

const { downloads } = storeToRefs(useDownloadStore());
const { startDownload } = useDownloadStore();

const download = () => {
  const downloadUrl = URL.parse(url.value);
  if (downloadUrl == null) {
    console.error('Invalid URL:', url.value);
    return;
  }

  downloadUrl.searchParams.delete('pagesize');
  downloadUrl.searchParams.delete('pagenumber');
  downloadUrl.searchParams.delete('limit');
  downloadUrl.searchParams.delete('offset');

  if (isDownloadCSV.value) {
    downloadUrl.searchParams.set('format', 'csv');
    startDownload(`${downloadUrl}`);
  }
  if (isDownloadJson.value) {
    startDownload(`${downloadUrl}`);
  }
};
</script>
