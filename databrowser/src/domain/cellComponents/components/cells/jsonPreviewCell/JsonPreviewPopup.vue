<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="relative overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg"
  >
    <ButtonCustom
      variant="ghost"
      size="xs"
      class="absolute top-2 right-2 flex size-6 items-center justify-center bg-white"
      :title="
        copied
          ? t('components.jsonViewer.copied')
          : t('components.jsonViewer.copyJson')
      "
      @click="copy(JSON.stringify(data, null, 2))"
    >
      <IconCopy v-if="!copied" class="size-3.5" />
      <IconCheck v-else class="size-3.5" />
    </ButtonCustom>
    <pre
      ref="pre"
      class="max-h-[60vh] overflow-hidden p-3 pr-10 font-mono text-xs leading-snug break-all whitespace-pre-wrap"
    ><span
        v-for="(token, index) in tokens"
        :key="index"
        :class="tokenClasses[token.type]"
      >{{ token.text }}</span></pre>
    <!-- Shown when the JSON doesn't fit into the popup -->
    <div
      v-if="isCutOff"
      class="absolute inset-x-0 bottom-0 bg-linear-to-t from-white from-60% to-transparent px-3 pt-6 pb-1 font-mono text-xs text-gray-700"
    >
      …
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import IconCheck from '../../../../../components/svg/IconCheck.vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import { tokenClasses, tokenize } from './jsonTokens';

// Read-only preview of JSON data with simple syntax highlighting, shown on
// hover in table views. Very long JSON is cut off after MAX_LINES lines.
const props = defineProps<{ data: unknown }>();

const MAX_LINES = 60;

const { t } = useI18n();
const { copy, copied } = useClipboard();

const pre = ref<HTMLElement>();
const isCutOff = ref(false);

onMounted(() => {
  const el = pre.value;
  isCutOff.value = el != null && el.scrollHeight > el.clientHeight;
});

const tokens = computed(() => {
  const lines = JSON.stringify(props.data, null, 2).split('\n');
  const text =
    lines.length > MAX_LINES
      ? [...lines.slice(0, MAX_LINES), '…'].join('\n')
      : lines.join('\n');
  return tokenize(text);
});
</script>
