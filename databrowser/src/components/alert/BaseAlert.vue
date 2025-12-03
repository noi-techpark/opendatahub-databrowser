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
      class="my-1 flex h-14 w-20 shrink-0 items-center justify-center"
      :class="classNames.iconBackground"
    >
      <slot name="icon">
        <IconCheck v-if="type === 'info'" :class="classNames.icon" /><IconWarning v-else />
      </slot>
    </div>
    <div :class="classNames.text" class="mt-2 min-w-0 break-words">
      <div v-if="title != null" class="font-semibold">{{ title }}</div>
      <div v-if="hasContent" class="text-sm">
        <slot></slot>
      </div>
    </div>
    <button
      v-if="hasCloseButton"
      class="mt-5 absolute right-2 top-2 rounded flex items-center"
      :class="classNames.text"
      @click="emit('close')"
    >
      <IconClose class="size-6" />
      <span class="font-semibold">{{t('datasets.header.alert.cancel')}}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import IconCheck from '../svg/IconCheck.vue';
import IconClose from '../svg/IconClose.vue';
import IconWarning from '../svg/IconWarning.vue';
import { AlertType } from './types';
import { useI18n } from 'vue-i18n';

interface Color {
  background: string;
  text: string;
  iconBackground: string;
  icon: string;
}

const types: Record<string, Color> = {
  calm: {
    background: 'bg-hint-calm-secondary',
    text: 'text-hint-calm',
    iconBackground: 'bg-hint-calm',
    icon: 'text-white',
  },
  info: {
    background: 'bg-hint-info',
    text: 'text-white',
    iconBackground: 'bg-white',
    icon: 'text-hint-info',
  },
  warning: {
    background: 'bg-hint-warning-secondary',
    text: 'text-hint-warning',
    iconBackground: 'bg-hint-warning',
    icon: 'text-white',
  },
  error: {
    background: 'bg-hint-error-secondary',
    text: 'text-hint-error',
    iconBackground: 'bg-hint-error',
    icon: 'text-white',
  }
};

const emit = defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{
  type: AlertType;
  title?: string;
  hasCloseButton?: boolean;
  hideIcon?: boolean;
}>();

const hasContent = computed(() => useSlots().default != null);

const { t } = useI18n();

const classNames = computed(() => types[props.type]);
</script>
