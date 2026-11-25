<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="pointer-events-none relative overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg"
  >
    <pre
      ref="pre"
      class="max-h-[60vh] overflow-hidden p-3 font-mono text-xs leading-snug break-all whitespace-pre-wrap"
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

// Read-only preview of JSON data with simple syntax highlighting, shown on
// hover in table views. Very long JSON is cut off after MAX_LINES lines.
const props = defineProps<{ data: unknown }>();

const MAX_LINES = 60;

type TokenType = 'key' | 'string' | 'number' | 'literal' | 'other';

// Colors similar to Monaco's "vs" theme
const tokenClasses: Record<TokenType, string> = {
  key: 'text-[#a31515]',
  string: 'text-[#0451a5]',
  number: 'text-[#098658]',
  literal: 'text-[#0000ff]',
  other: 'text-gray-700',
};

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

// Strings followed by a colon are keys
const tokenPattern =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

const tokenize = (text: string): { text: string; type: TokenType }[] => {
  const result: { text: string; type: TokenType }[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(tokenPattern)) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index), type: 'other' });
    }
    const [, str, colon, num, literal] = match;
    if (str != null) {
      result.push({ text: str, type: colon != null ? 'key' : 'string' });
      if (colon != null) {
        result.push({ text: colon, type: 'other' });
      }
    } else if (num != null) {
      result.push({ text: num, type: 'number' });
    } else if (literal != null) {
      result.push({ text: literal, type: 'literal' });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), type: 'other' });
  }
  return result;
};
</script>
