<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isObject" class="flex flex-col gap-2">
    <div class="flex gap-2">
      <JsonViewerToolbar
        :data="data"
        @expand-all="viewer?.unfoldAll()"
        @collapse-all="viewer?.foldAll()"
      />
    </div>
    <JsonMonacoViewer
      ref="viewer"
      :data="data"
      height="content"
      max-height="70vh"
    />
  </div>
  <span v-else-if="data != null" class="font-mono text-sm">{{
    plainText
  }}</span>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import JsonViewerToolbar from './JsonViewerToolbar.vue';

// Shows JSON data in a read-only Monaco editor, e.g. in detail views
const JsonMonacoViewer = defineAsyncComponent(
  () => import('./JsonMonacoViewer.vue')
);

const props = defineProps<{ data?: unknown }>();

const viewer = ref<{ foldAll: () => void; unfoldAll: () => void }>();

// Empty objects / arrays and primitive values are shown as plain text
const isObject = computed(
  () =>
    props.data != null &&
    typeof props.data === 'object' &&
    Object.keys(props.data).length > 0
);

const plainText = computed(() =>
  typeof props.data === 'string' ? props.data : JSON.stringify(props.data)
);
</script>
