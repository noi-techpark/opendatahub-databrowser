<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <span>{{ compiledTemplate }}</span>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  stringTemplate: string;
  p1?: unknown;
  p2?: unknown;
  p3?: unknown;
  p4?: unknown;
  p5?: unknown;
  p6?: unknown;
  p7?: unknown;
  p8?: unknown;
  p9?: unknown;
  p10?: unknown;
}>();

const { stringTemplate } = toRefs(props);

const compiledTemplate = Object.keys(props)
  .filter((key) => key != 'stringTemplate')
  .reduce((previous, key, index) => {
    const parameterName = `p${index + 1}`;
    const value = (props as Record<string, unknown>)[parameterName];

    if (value == null || typeof value !== 'string') {
      return previous;
    }

    return previous.replaceAll(`{${key}}`, value);
  }, stringTemplate.value);
</script>
