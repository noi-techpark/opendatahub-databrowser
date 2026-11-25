<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isObject" class="flex items-start gap-2">
    <div class="flex shrink-0 flex-col gap-1">
      <ButtonCustom
        variant="ghost"
        size="xs"
        class="flex size-8 items-center justify-center"
        :title="t('components.jsonViewer.openFullscreen')"
        @click.stop="isFullscreenOpen = true"
        @dblclick.stop
      >
        <IconExpand class="size-4 text-green-500" />
      </ButtonCustom>
      <ButtonCustom
        variant="ghost"
        size="xs"
        class="flex size-8 items-center justify-center"
        :title="
          copied
            ? t('components.jsonViewer.copied')
            : t('components.jsonViewer.copyJson')
        "
        @click.stop="copy(JSON.stringify(data, null, 2))"
        @dblclick.stop
      >
        <IconCopy v-if="!copied" class="size-4 text-green-500" />
        <IconCheck v-else class="size-4 text-green-500" />
      </ButtonCustom>
    </div>
    <div
      ref="previewTrigger"
      class="line-clamp-4 font-mono text-xs break-all whitespace-pre-wrap"
      @mouseenter="openPreview"
      @mouseleave="closePreview"
      v-text="compactPreview"
    ></div>

    <!-- Hover preview, teleported so table overflow / sticky columns don't cut it off -->
    <Teleport v-if="isPreviewOpen" to="body">
      <div ref="previewPopup" class="absolute top-0 left-0 z-50">
        <JsonPreviewPopup :data="data" />
      </div>
    </Teleport>

    <!-- Monaco is only loaded when the dialog is opened -->
    <DialogFullScreen
      v-if="isFullscreenOpen"
      :is-open="isFullscreenOpen"
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
  <span v-else-if="data != null" class="font-mono text-xs">{{
    plainText
  }}</span>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import DialogFullScreen from '../../../../../components/dialog/DialogFullScreen.vue';
import IconCheck from '../../../../../components/svg/IconCheck.vue';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconExpand from '../../../../../components/svg/IconExpand.vue';
import { useFloatingUi } from '../../../../../components/utils/useFloatingUi';
import JsonViewerToolbar from '../jsonViewerCell/JsonViewerToolbar.vue';
import JsonPreviewPopup from './JsonPreviewPopup.vue';

// Shows JSON data in table views: a compact preview of a few lines and a
// button that opens the full JSON in a fullscreen Monaco editor.
const JsonMonacoViewer = defineAsyncComponent(
  () => import('../jsonViewerCell/JsonMonacoViewer.vue')
);

const props = defineProps<{ data?: unknown }>();

const { t } = useI18n();

const isFullscreenOpen = ref(false);

const { copy, copied } = useClipboard();
const viewer = ref<{ foldAll: () => void; unfoldAll: () => void }>();

// Empty objects / arrays and primitive values are shown as plain text
const isObject = computed(
  () =>
    props.data != null &&
    typeof props.data === 'object' &&
    Object.keys(props.data).length > 0
);

const compactJson = computed(() => JSON.stringify(props.data));

// Strings are shown without JSON quotes
const plainText = computed(() =>
  typeof props.data === 'string' ? props.data : compactJson.value
);

// The cell shows only 4 lines, so don't render (and lay out) huge JSON
const compactPreview = computed(() =>
  JSON.stringify(props.data, null, 2).slice(0, 500)
);

// Delay opening, so moving the mouse across the table doesn't flash popups
const PREVIEW_OPEN_DELAY_MS = 300;

const isPreviewOpen = ref(false);
let openTimer: ReturnType<typeof setTimeout> | undefined;

const [previewTrigger, previewPopup] = useFloatingUi({
  placement: 'right-start',
  offset: 8,
  maxWidth: 640,
});

const scrollListenerOptions = { capture: true, passive: true };

const openPreview = () => {
  clearTimeout(openTimer);
  openTimer = setTimeout(() => {
    isPreviewOpen.value = true;
    // The popup doesn't follow the cell, so close it when anything scrolls
    window.addEventListener('scroll', closePreview, scrollListenerOptions);
  }, PREVIEW_OPEN_DELAY_MS);
};

const closePreview = () => {
  clearTimeout(openTimer);
  isPreviewOpen.value = false;
  window.removeEventListener('scroll', closePreview, scrollListenerOptions);
};

onBeforeUnmount(closePreview);
</script>
