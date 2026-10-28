<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="inline-flex items-center gap-2 rounded-sm px-3 py-1"
    :class="[classNames.background, textSizeClass]"
  >
    <div
      v-if="hasDot"
      class="size-1 rounded-full"
      :class="classNames.dot"
    ></div>
    <span :class="classNames.text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TagSize, TagType } from './types';

interface Color {
  background: string;
  text: string;
  dot: string;
}

const types: Record<TagType, Color> = {
  black: {
    background: 'bg-black',
    text: 'text-white',
    dot: 'bg-white',
  },
  white: {
    background: 'bg-gray-50',
    text: 'text-dialog',
    dot: 'bg-dialog',
  },
  blue: {
    background: 'bg-hint-calm-secondary',
    text: 'text-hint-calm',
    dot: 'bg-hint-calm',
  },
  calm: {
    background: 'bg-dialog',
    text: 'text-white',
    dot: 'bg-white',
  },
  green: {
    background: 'bg-hint-info-secondary',
    text: 'text-hint-info',
    dot: 'bg-hint-info',
  },
  red: {
    background: 'bg-hint-error-secondary',
    text: 'text-hint-error',
    dot: 'bg-hint-error',
  },
  yellow: {
    background: 'bg-hint-warning-secondary',
    text: 'text-hint-warning',
    dot: 'bg-hint-warning',
  },
  info: {
    background: 'bg-yellow-400',
    text: 'text-black',
    dot: 'bg-black',
  },
  pink: {
    background: 'bg-pink-400',
    text: 'text-black',
    dot: 'bg-black',
  },
  purple: {
    background: 'bg-deprecated',
    text: 'text-white',
    dot: 'bg-white',
  },
  reference: {
    background: 'bg-reference',
    text: 'text-white',
    dot: 'bg-white',
  },
};

const props = withDefaults(
  defineProps<{
    type: TagType;
    text: string;
    size?: TagSize;
    hasDot?: boolean;
  }>(),
  {
    size: 'md',
    hasDot: false,
  }
);

const classNames = computed(() => types[props.type]);
const textSizeClass = computed(() => (props.size === 'xs' ? 'text-xs' : ''));
</script>
