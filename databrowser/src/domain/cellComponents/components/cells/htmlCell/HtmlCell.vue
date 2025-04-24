<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isWriteable" class="html-content">
    <TipTapEditor v-model="content" />
  </div>
  <div v-else v-html="html" class="html-content"></div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, toRefs } from 'vue';
import { useWriteable } from '../../utils/writeable/useWriteable';

const TipTapEditor = defineAsyncComponent(() =>
  import('../../../../../components/html/TipTapEditor.vue').then(
    (exports) => exports.default
  )
);

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{
    html?: string;
    editable?: boolean;
    readonly?: string | boolean;
  }>(),
  {
    html: undefined,
    editable: true,
    readonly: false,
  }
);

const { editable, readonly } = toRefs(props);
const isWriteable = useWriteable({ editable, readonly });

const content = computed<string>({
  get: () => props.html ?? '',
  set: (value) => emit('update', { prop: 'html', value }),
});
</script>

<style>
.html-content a {
  @apply text-green-500;
}

.html-content h1,
.html-content h2,
.html-content h3,
.html-content h4,
.html-content h5,
.html-content h6 {
  @apply mb-2 mt-4;
}

.html-content h1 {
  @apply text-2xl;
}

.html-content h2 {
  @apply text-xl;
}

.html-content h3 {
  @apply text-lg;
}

.html-content h4 {
  @apply text-base;
}

.html-content h5 {
  @apply text-sm;
}
.html-content h6 {
  @apply text-xs;
}

.html-content ol,
.html-content ul {
  @apply m-2 pl-2;
}

.html-content ol {
  @apply list-decimal;
}
.html-content ul {
  @apply list-disc;
}

.html-content blockquote {
  @apply my-2 border-l-4 border-l-gray-400 p-2 pl-4;
}
</style>
