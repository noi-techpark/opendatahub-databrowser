<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    v-if="title != null || hasContent"
    class="relative flex gap-8 px-4 py-2"
    :class="classNames.background"
  >
    <div
      v-if="!hideIcon"
      class="my-1 flex h-14 w-20 shrink-0 items-center justify-center text-white"
      :class="classNames.icon"
    >
      <slot name="icon">
        <IconCheck v-if="type === 'info'" /><IconWarning v-else />
      </slot>
    </div>
    <div :class="classNames.text" class="min-w-0 break-words">
      <div v-if="title != null" class="font-semibold">{{ title }}</div>
      <div v-if="hasContent" class="text-sm">
        <slot></slot>
      </div>
    </div>
    <button
      v-if="hasCloseButton"
      class="absolute right-2 top-2 rounded"
      :class="classNames.text"
    >
      <IconClose class="size-6" @click="emit('close')" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import IconCheck from '../svg/IconCheck.vue';
import IconClose from '../svg/IconClose.vue';
import IconWarning from '../svg/IconWarning.vue';
import { AlertType } from './types';

interface Color {
  background: string;
  text: string;
  icon: string;
}

const types: Record<string, Color> = {
  calm: {
    background: 'bg-hint-calm-secondary',
    text: 'text-hint-calm',
    icon: 'bg-hint-calm',
  },
  info: {
    background: 'bg-hint-info-secondary',
    text: 'text-hint-info',
    icon: 'bg-hint-info',
  },
  warning: {
    background: 'bg-hint-warning-secondary',
    text: 'text-hint-warning',
    icon: 'bg-hint-warning',
  },
  error: {
    background: 'bg-hint-error-secondary',
    text: 'text-hint-error',
    icon: 'bg-hint-error',
  },
};

const emit = defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{
  type: AlertType;
  title?: string;
  hasCloseButton?: boolean;
  hideIcon?: boolean;
}>();

const hasContent = computed(() => useSlots().default != null);

const classNames = computed(() => types[props.type]);
</script>
