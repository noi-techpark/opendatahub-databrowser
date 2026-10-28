<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <component
    :is="tagName"
    class="flex flex-col rounded-sm border border-gray-300"
    :class="paddingClasses"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tagName?: string;
    noPadding?: boolean;
  }>(),
  {
    tagName: 'div',
    noPadding: false,
  }
);

const paddingClasses = computed(() =>
  props.noPadding ? '' : 'px-3 pt-3 pb-5 lg:px-5 lg:pt-4'
);
</script>
