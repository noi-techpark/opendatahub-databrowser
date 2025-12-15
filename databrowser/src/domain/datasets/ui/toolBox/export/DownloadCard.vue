<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxCard>
    <ToolBoxCardHeader :uppercase="false" class="rounded">
      <div class="flex items-center gap-2">
        {{ t('datasets.toolBox.exportDatasets.download.header') }}
        <InfoDownload />
      </div>
    </ToolBoxCardHeader>
    <ToolBoxCardBody>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2">
          <ToggleCustom
            v-model="isDownloadCSV"
            :disabled="datasetDomain !== 'tourism'"
          />
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
        <div class="flex items-center gap-2">
          <ToggleCustom v-model="isDownloadMedia" :disabled="true"></ToggleCustom>
          <div class="flex flex-col text-xs disabled">
            <span class="font-bold">
              {{ t('datasets.toolBox.exportDatasets.download.media.header') }}
            </span>
            <span>
              {{ t('datasets.toolBox.exportDatasets.download.media.body') }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center mt-4">
        <ButtonCustom
          class="mt-4 flex items-center gap-3 px-2 py-1.5 text-sm"
          :size="Size.xs"
          :aria-label="t('datasets.toolBox.exportDatasets.download.buttonAlt')"
          :disabled="isDownloadButtonDisabled"
          @click="download"
        >

          <IconDownload class="size-4" />
          {{ t('datasets.toolBox.exportDatasets.download.button') }}
        </ButtonCustom>
        <span v-if="isDownloadInProgress" class="text-xs font-semibold text-dialog ml-6 mt-4">Download preparation in progress...</span>
      </div>
    </ToolBoxCardBody>
  </ToolBoxCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {computed, ref, toRefs} from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Size } from '@/components/button/types';
import IconDownload from '@/components/svg/IconDownload.vue';
import ToggleCustom from '@/components/toggle/ToggleCustom.vue';
import { useDownloadStore } from '../../../../download/downloadStore';
import { useMetaDataForRoute } from '../../../../metaDataConfig/tourism/useMetaData';
import { useDatasetBaseInfoStore } from '../../../config/store/datasetBaseInfoStore';
import ToolBoxCard from '../ToolBoxCard.vue';
import ToolBoxCardBody from '../ToolBoxCardBody.vue';
import ToolBoxCardHeader from '../ToolBoxCardHeader.vue';
import InfoDownload from "@/domain/datasets/ui/toolBox/export/InfoDownload.vue";

const { t } = useI18n();
const downloadStore = useDownloadStore();

const props = defineProps<{
  url: string;
}>();

const { url } = toRefs(props);

const isDownloadMedia = ref(false);
const isDownloadJson = ref(false);
const isDownloadCSV = ref(true);


const isDownloadInProgress = computed(()=>{
  return downloadStore.activeDownloads.length > 0;
})

const isDownloadButtonDisabled = computed(() => {
  return (!isDownloadJson.value && !isDownloadCSV.value) || isDownloadInProgress.value;
});

const { datasetDomain, datasetPath, datasetQuery } = storeToRefs(
  useDatasetBaseInfoStore()
);
const { currentMetaData } = useMetaDataForRoute(datasetPath, datasetQuery);

const { startDownload } = useDownloadStore();

const download = () => {
  const downloadUrl = URL.parse(url.value);
  if (downloadUrl == null) {
    console.error('Invalid URL:', url.value);
    return;
  }

  // Set request parameters based on API and download type
  switch (datasetDomain.value) {
    case 'tourism':
      downloadUrl.searchParams.set('pagesize', '1000000');
      break;
    case 'mobility':
      downloadUrl.searchParams.set('limit', '1000000');
      break;
    default:
      console.debug(
        `Unknown dataset domain (${datasetDomain.value}), no additional request parameters set.`
      );
      return;
  }

  const filename = currentMetaData.value?.shortname || 'download';

  // Start download based on selected formats
  // It is possible to download both formats at the same time
  if (isDownloadJson.value) {
    startDownload(`${downloadUrl}`, filename, 'json');
  }
  if (isDownloadCSV.value) {
    if (datasetDomain.value === 'tourism') {
      downloadUrl.searchParams.set('format', 'csv');
    }
    startDownload(`${downloadUrl}`, filename, 'csv');
  }
};
</script>

<style scoped>
.disabled{
  opacity: 0.5;
}
</style>
