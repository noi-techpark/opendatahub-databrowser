<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>

    <ToolBoxSectionLabel>
      {{ t('datasets.toolBox.exportDatasets.sectionRetrieveData') }}
    </ToolBoxSectionLabel>

    <ToolBoxCard v-if="url != null">
      <ToolBoxCardHeader :uppercase="false" class="rounded">
        {{ t('datasets.toolBox.exportDatasets.apiDatasets.header') }}
      </ToolBoxCardHeader>
      <ToolBoxCardBody class="break-all">
        <span class="block w-full">
          {{ url }}
        </span>
        <ButtonCustom
          class="mt-4 flex items-center gap-3 px-2 py-1.5 text-sm"
          :size="Size.xs"
          :aria-label="t('datasets.toolBox.exportDatasets.download.iconAlt')"
          @click="copyUrl()"
        >
          <IconCopy v-if="!copiedUrl" class="size-4" />
          <IconCheck v-else class="size-4" />
          <span>{{ t('datasets.toolBox.exportDatasets.apiDatasets.button') }}</span>
        </ButtonCustom>
      </ToolBoxCardBody>
    </ToolBoxCard>

    <DownloadCard v-if="url != null" :url="url"></DownloadCard>

    <ToolBoxSectionLabel v-if="!!referencesUrls">{{
      t('datasets.toolBox.exportDatasets.sectionReferencesData')
    }}</ToolBoxSectionLabel>

    <ToolBoxCard
      v-for="referenceUrl in referencesUrls || []"
      :key="getReferenceKey(referenceUrl)"
      class="rounded"
    >
      <ToolBoxCardHeader :uppercase="false" class="rounded">
        <span class="truncate">
          {{ referenceUrl.from }}
        </span>

        <button
          class="rounded text-green-500 outline-offset-1"
          @click="referencesUrlsAccordions[getReferenceKey(referenceUrl)] = !referencesUrlsAccordions[getReferenceKey(referenceUrl)]"
        >
          <ArrowLine
            class="size-4 transition"
            :class="
              referencesUrlsAccordions[getReferenceKey(referenceUrl)]
                ? '-rotate-90'
                : 'rotate-90'
            "
          />
        </button>
      </ToolBoxCardHeader>
      <ToolBoxCardBody v-if="referencesUrlsAccordions[getReferenceKey(referenceUrl)]">
        <div class="items-center gap-1">
          <p class="break-all font-mono text-xs">{{ referenceUrl.url }}</p>
            <ButtonCustom
              class="mt-4 flex items-center gap-3 px-2 py-1.5 text-sm"
              :size="Size.xs"
              :aria-label="t('datasets.toolBox.exportDatasets.download.iconAlt')"
              @click="onCopyReference(referenceUrl.url)"
            >
              <IconCheck v-if="referenceUrlToCopy === referenceUrl.url && referenceUrlCopied" class="size-4" />
              <IconCopy v-else class="size-4" />
              <span>{{ t('datasets.toolBox.exportDatasets.apiDatasets.button') }}</span>
            </ButtonCustom>
        </div>
      </ToolBoxCardBody>
    </ToolBoxCard>

    <ToolBoxSectionLabel>{{
      t('datasets.toolBox.exportDatasets.sectionFurtherDetails')
    }}</ToolBoxSectionLabel>

    <ToolBoxCard>
      <ToolBoxCardHeader :uppercase="false" class="rounded">
        {{ t('datasets.toolBox.exportDatasets.documentation.header') }}
      </ToolBoxCardHeader>
      <ToolBoxCardBody>
        <div>
          {{ t('datasets.toolBox.exportDatasets.documentation.body') }}
        </div>
        <ButtonExternalLink
          href="https://opendatahub.readthedocs.io/en/latest/index.html"
          class="mt-4 flex items-center gap-3 px-2 py-1.5 text-sm"
          :size="Size.xs"
          target="_blank"
        >
          <IconInfo class="size-4" />
          <span>{{ t('datasets.toolBox.exportDatasets.documentation.button') }}</span>
        </ButtonExternalLink>
      </ToolBoxCardBody>
    </ToolBoxCard>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ArrowLine from '@/components/svg/ArrowLine.vue';
import IconCheck from '@/components/svg/IconCheck.vue';
import IconCopy from '@/components/svg/IconCopy.vue';
import ToolBoxCard from '../ToolBoxCard.vue';
import ToolBoxCardBody from '../ToolBoxCardBody.vue';
import ToolBoxCardHeader from '../ToolBoxCardHeader.vue';
import ToolBoxSectionLabel from '../ToolBoxSectionLabel.vue';
import { ReferenceInfoToolBoxFetchUrlInfo } from '../types';
import DownloadCard from './DownloadCard.vue';
import ButtonCustom from "@/components/button/ButtonCustom.vue";
import {Size } from "@/components/button/types";
import IconInfo from "@/components/svg/IconInfo.vue";
import ButtonExternalLink from '@/components/button/ButtonExternalLink.vue';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    url?: string;
    referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
  }>(),
  { url: undefined, referencesUrls: undefined }
);

const { url, referencesUrls } = toRefs(props);

const referenceUrlToCopy = ref('');
const referencesUrlsAccordions = ref<Record<string, boolean>>({});

const { copy: copyUrl, copied: copiedUrl } = useClipboard({
  source: url.value,
});

const onCopyReference = (url: string) => {
  referenceUrlToCopy.value = url;
  copyReferenceUrl(url);
};

const { copy: copyReferenceUrl, copied:referenceUrlCopied } = useClipboard();

const getReferenceKey = (referenceUrl: ReferenceInfoToolBoxFetchUrlInfo) => {
  return `${referenceUrl.from}_${referenceUrl.url}`;
};

watch(referencesUrls, (newVal) => {
  if (!newVal) return;

  const obj: Record<string, boolean> = {};

  for (const el of newVal) {
    obj[getReferenceKey(el)] = false;
  }

  referencesUrlsAccordions.value = obj;
});
</script>
