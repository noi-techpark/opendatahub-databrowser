<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isObject" class="h-6">
    <div
      ref="previewTrigger"
      class="absolute inset-0 bg-white text-xs"
      :class="
        isCompact ? 'flex items-center px-3' : 'flex flex-col overflow-hidden'
      "
      @mouseenter="openPreview"
      @mouseleave="scheduleClosePreview"
    >
      <!-- Not enough height for a preview: only show a compact badge -->
      <div
        v-if="isCompact"
        class="flex h-7 w-full items-center overflow-hidden rounded-sm border border-lightgray"
      >
        <span
          class="flex items-center self-stretch border-r border-gray-200 bg-gray-50 px-2.5 font-semibold text-gray-900"
        >
          JSON
        </span>
        <span class="grow px-2.5 font-mono text-gray-600">{...}</span>
        <ButtonCustom
          variant="ghost"
          size="xs"
          class="mr-0.5 flex size-6 items-center justify-center bg-white"
          :title="t('components.jsonViewer.openFullscreen')"
          @click.stop="isFullscreenOpen = true"
          @dblclick.stop
        >
          <IconEye class="size-3.5 stroke-current" />
        </ButtonCustom>
      </div>
      <template v-else>
        <div
          class="flex shrink-0 items-center gap-1 border-b border-gray-200 bg-gray-50 py-0.5 pr-1 pl-2.5"
        >
          <span class="grow font-semibold text-gray-900">JSON</span>
          <ButtonCustom
            variant="ghost"
            size="xs"
            class="flex size-6 items-center justify-center bg-white"
            :title="t('components.jsonViewer.openFullscreen')"
            @click.stop="isFullscreenOpen = true"
            @dblclick.stop
          >
            <IconEye class="size-3.5 stroke-current" />
          </ButtonCustom>
        </div>
        <div
          ref="previewBody"
          class="min-h-0 grow overflow-hidden bg-white px-2.5 py-1 font-mono text-[11px] leading-4"
        >
          <div
            v-for="(line, lineIndex) in visibleLines"
            :key="lineIndex"
            class="truncate whitespace-pre"
          >
            <span
              v-for="(token, tokenIndex) in line"
              :key="tokenIndex"
              :class="tokenClasses[token.type]"
              >{{ token.text }}</span
            >
          </div>
        </div>
      </template>
    </div>

    <!-- Hover preview, teleported so table overflow / sticky columns don't cut it off -->
    <Teleport v-if="isPreviewOpen" to="body">
      <div
        ref="previewPopup"
        class="absolute top-0 left-0 z-50"
        @mouseenter="cancelClosePreview"
        @mouseleave="scheduleClosePreview"
      >
        <JsonPreviewPopup :data="data" />
      </div>
    </Teleport>

    <!-- Monaco is only loaded when the dialog is opened -->
    <DialogFullScreen
      v-if="isFullscreenOpen"
      :is-open="isFullscreenOpen"
      inset
      @close="isFullscreenOpen = false"
    >
      <div class="flex items-center gap-2 border-b border-gray-300 p-2">
        <JsonViewerToolbar
          :data="data"
          @expand-all="viewer?.unfoldAll()"
          @collapse-all="viewer?.foldAll()"
        />
        <ButtonCustom
          variant="ghost"
          size="xs"
          class="ml-auto flex size-11 items-center justify-center"
          :title="t('components.jsonViewer.close')"
          @click="isFullscreenOpen = false"
        >
          <IconClose class="text-green-400" />
        </ButtonCustom>
      </div>
      <div class="min-h-0 flex-1 p-2">
        <JsonMonacoViewer ref="viewer" :data="data" height="fill" />
      </div>
    </DialogFullScreen>
  </div>
  <div v-else-if="isEmpty" class="h-6">
    <div
      ref="emptyRoot"
      class="absolute inset-0 bg-white text-xs"
      :class="
        isCompact ? 'flex items-center px-3' : 'flex flex-col overflow-hidden'
      "
    >
      <div
        v-if="isCompact"
        class="flex h-7 w-full items-center overflow-hidden rounded-sm border border-lightgray"
      >
        <span
          class="flex items-center self-stretch border-r border-gray-200 bg-gray-50 px-2.5 font-semibold text-gray-900"
        >
          JSON
        </span>
        <span class="grow px-2.5 font-mono text-gray-400">{ }</span>
      </div>
      <template v-else>
        <div
          class="flex h-7 shrink-0 items-center border-b border-gray-200 bg-gray-50 px-2.5 font-semibold text-gray-900"
        >
          JSON
        </div>
        <div class="grow bg-white px-2.5 py-1 font-mono text-gray-400">{ }</div>
      </template>
    </div>
  </div>
  <span v-else class="font-mono text-xs">{{ plainText }}</span>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import DialogFullScreen from '../../../../../components/dialog/DialogFullScreen.vue';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconEye from '../../../../../components/svg/IconEye.vue';
import { useFloatingUi } from '../../../../../components/utils/useFloatingUi';
import JsonViewerToolbar from '../jsonViewerCell/JsonViewerToolbar.vue';
import { tokenClasses, tokenize } from './jsonTokens';
import JsonPreviewPopup from './JsonPreviewPopup.vue';

// Shows JSON data in table views: a badge with a hover preview, a button
// that opens the full JSON in a fullscreen Monaco editor.
const JsonMonacoViewer = defineAsyncComponent(
  () => import('../jsonViewerCell/JsonMonacoViewer.vue')
);

const props = defineProps<{ data?: unknown }>();

const { t } = useI18n();

const isFullscreenOpen = ref(false);

const viewer = ref<{ foldAll: () => void; unfoldAll: () => void }>();

// Primitive values are shown as plain text
const isObject = computed(
  () =>
    props.data != null &&
    typeof props.data === 'object' &&
    Object.keys(props.data).length > 0
);

const isEmpty = computed(
  () =>
    props.data == null ||
    (typeof props.data === 'object' && Object.keys(props.data).length === 0)
);

// Only the start is needed, the cell shows as many lines as fit
const PREVIEW_MAX_LINES = 40;
const LINE_HEIGHT_PX = 16;
const BODY_PADDING_PX = 8;

const HEADER_HEIGHT_PX = 29;

// Below this cell height the preview would show at most one line
const cellHeight = ref(0);
const isCompact = computed(
  () =>
    cellHeight.value - HEADER_HEIGHT_PX - BODY_PADDING_PX < LINE_HEIGHT_PX * 2
);

const emptyRoot = ref<HTMLElement>();
const updateCellHeight = ([entry]: ResizeObserverEntry[]) => {
  cellHeight.value = entry.contentRect.height;
};

const previewBody = ref<HTMLElement>();
const bodyHeight = ref(0);
useResizeObserver(previewBody, ([entry]) => {
  bodyHeight.value = entry.contentRect.height;
});

const previewLines = computed(() =>
  (JSON.stringify(props.data, null, 2) ?? '')
    .split('\n')
    .slice(0, PREVIEW_MAX_LINES + 1)
);

// Replaces the last visible line with an ellipsis if lines are left out
const visibleLines = computed(() => {
  const all = previewLines.value;
  const fit = Math.max(
    1,
    Math.floor((bodyHeight.value - BODY_PADDING_PX) / LINE_HEIGHT_PX)
  );
  if (all.length <= fit && all.length <= PREVIEW_MAX_LINES) {
    return all.map((line) => tokenize(line));
  }
  const shown = Math.min(fit, PREVIEW_MAX_LINES);
  return [
    ...all.slice(0, shown - 1).map((line) => tokenize(line)),
    [{ text: '…', type: 'other' as const }],
  ];
});

const compactJson = computed(() => JSON.stringify(props.data));

// Strings are shown without JSON quotes
const plainText = computed(() =>
  typeof props.data === 'string' ? props.data : compactJson.value
);

// Delay opening, so moving the mouse across the table doesn't flash popups
const PREVIEW_OPEN_DELAY_MS = 300;
const PREVIEW_CLOSE_DELAY_MS = 150;

const isPreviewOpen = ref(false);
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

const [previewTrigger, previewPopup] = useFloatingUi({
  placement: 'right-start',
  offset: 8,
  maxWidth: 640,
});

useResizeObserver(previewTrigger, updateCellHeight);
useResizeObserver(emptyRoot, updateCellHeight);

const scrollListenerOptions = { capture: true, passive: true };

const openPreview = () => {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  openTimer = setTimeout(() => {
    isPreviewOpen.value = true;
    // The popup doesn't follow the cell, so close it when anything scrolls
    window.addEventListener('scroll', closePreview, scrollListenerOptions);
  }, PREVIEW_OPEN_DELAY_MS);
};

// Gives the mouse time to move from the cell onto the popup
const scheduleClosePreview = () => {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  closeTimer = setTimeout(closePreview, PREVIEW_CLOSE_DELAY_MS);
};

const cancelClosePreview = () => clearTimeout(closeTimer);

const closePreview = () => {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  isPreviewOpen.value = false;
  window.removeEventListener('scroll', closePreview, scrollListenerOptions);
};

onBeforeUnmount(closePreview);
</script>
