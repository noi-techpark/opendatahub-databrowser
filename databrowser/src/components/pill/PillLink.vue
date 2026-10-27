<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <router-link
    :to="to"
    :class="[
      {
        'bg-green-500/10 text-green-500': active && !disabled,
        'hover:bg-gray-50': !active && !disabled,
        'pointer-events-none border border-gray-500 bg-transparent text-gray-700 opacity-25':
          disabled,
      },
      classNames,
    ]"
    :disabled="disabled"
    class="block border font-semibold no-underline focus:outline-hidden"
  >
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PillVariant } from './types';
import { RouteLocationRaw } from 'vue-router';

const variantStyles: Record<PillVariant, string> = {
  [PillVariant.edged]: 'rounded-sm border-transparent',
};

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw;
    variant?: string;
    disabled?: boolean;
    active?: boolean;
  }>(),
  {
    variant: PillVariant.edged,
    disabled: false,
    active: false,
  }
);

const classNames = computed(() => variantStyles[props.variant as PillVariant]);
</script>
