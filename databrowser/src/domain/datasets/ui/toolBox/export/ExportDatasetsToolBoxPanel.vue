<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxPanel>
    <ToolBoxSectionLabel>{{
      t('datasets.toolBox.exportDatasets.sectionRetrieveData')
    }}</ToolBoxSectionLabel>
    <ToolBoxCard v-if="url != null">
      <ToolBoxCardHeader>
        {{ t('datasets.toolBox.exportDatasets.apiDatasets.header') }}
        <ToolBoxCardHeaderButton
          :aria-label="t('datasets.toolBox.exportDatasets.apiDatasets.iconAlt')"
          @icon-click="copyUrl"
        >
          <IconCopy v-if="!copiedUrl" />
          <IconCheck v-else />
        </ToolBoxCardHeaderButton>
      </ToolBoxCardHeader>
      <ToolBoxCardBody :with-bg-color="withBgColor" class="break-all">{{
        url
      }}</ToolBoxCardBody>
    </ToolBoxCard>

    <DownloadCard v-if="url != null" :url="url"></DownloadCard>

    <ToolBoxSectionLabel v-if="!!referencesUrls">{{
      t('datasets.toolBox.exportDatasets.sectionReferencesData')
    }}</ToolBoxSectionLabel>
    <ToolBoxCard
      v-for="referenceUrl in referencesUrls || []"
      :key="getReferenceKey(referenceUrl)"
    >
      <ToolBoxCardHeader :uppercase="false">
        <span
          class="truncate"
          :class="{
            'text-hint-info':
              referencesUrlsAccordions[getReferenceKey(referenceUrl)],
          }"
          >{{ referenceUrl.from }}</span
        >
        <ToolBoxCardHeaderButton
          @icon-click="
            referencesUrlsAccordions[getReferenceKey(referenceUrl)] =
              !referencesUrlsAccordions[getReferenceKey(referenceUrl)]
          "
        >
          <ArrowLine
            class="size-4 text-green-400 transition"
            :class="
              referencesUrlsAccordions[getReferenceKey(referenceUrl)]
                ? '-rotate-90'
                : 'rotate-90'
            "
          />
        </ToolBoxCardHeaderButton>
      </ToolBoxCardHeader>
      <ToolBoxCardBody
        v-if="referencesUrlsAccordions[getReferenceKey(referenceUrl)]"
        :with-bg-color="withBgColor"
        ><div class="flex items-center gap-1">
          <p class="break-all font-mono text-xs">{{ referenceUrl.url }}</p>

          <div class="basis-4">
            <IconCopy
              v-if="
                referenceUrlToCopy !== referenceUrl.url && !copiedReferenceUrl
              "
              class="size-4 cursor-pointer text-green-400"
              @click="onCopyReference(referenceUrl.url)"
            />
            <IconCheck v-else class="size-4 text-green-400" />
          </div></div
      ></ToolBoxCardBody>
    </ToolBoxCard>

    <ToolBoxSectionLabel>{{
      t('datasets.toolBox.exportDatasets.sectionFurtherDetails')
    }}</ToolBoxSectionLabel>

    <ToolBoxCard>
      <ToolBoxCardHeader>
        {{ t('datasets.toolBox.exportDatasets.documentation.header') }}
        <a
          href="https://opendatahub.readthedocs.io/en/latest/index.html"
          target="_blank"
          class="rounded"
          :aria-label="
            t('datasets.toolBox.exportDatasets.documentation.iconAlt')
          "
        >
          <IconLink class="text-green-500" />
        </a>
      </ToolBoxCardHeader>
      <ToolBoxCardBody :with-bg-color="withBgColor">{{
        t('datasets.toolBox.exportDatasets.documentation.body')
      }}</ToolBoxCardBody>
    </ToolBoxCard>
  </ToolBoxPanel>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ArrowLine from '../../../../../components/svg/ArrowLine.vue';
import IconCheck from '../../../../../components/svg/IconCheck.vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconLink from '../../../../../components/svg/IconLink.vue';
import ToolBoxCard from '../ToolBoxCard.vue';
import ToolBoxCardBody from '../ToolBoxCardBody.vue';
import ToolBoxCardHeader from '../ToolBoxCardHeader.vue';
import ToolBoxCardHeaderButton from '../ToolBoxCardHeaderButton.vue';
import ToolBoxPanel from '../ToolBoxPanel.vue';
import ToolBoxSectionLabel from '../ToolBoxSectionLabel.vue';
import { ReferenceInfoToolBoxFetchUrlInfo } from '../types';
import DownloadCard from './DownloadCard.vue';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    url?: string;
    referencesUrls?: ReferenceInfoToolBoxFetchUrlInfo[];
    withBgColor?: boolean;
  }>(),
  { url: undefined, referencesUrls: undefined, withBgColor: true }
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

const { copy: copyReferenceUrl, copied: copiedReferenceUrl } = useClipboard();

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
