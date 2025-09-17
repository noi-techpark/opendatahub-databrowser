<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <button
    :class="[className, { relative: indicator }]"
    :disabled="disabled"
    button-custom
  >
    <div
      v-if="indicator"
      class="absolute right-2 top-2 h-1.5 w-1.5 rounded bg-green-500"
    ></div>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { computeButtonClasses } from './styles';
import { Size, Tone, Variant } from './types';

const props = withDefaults(
  defineProps<{
    variant?: string;
    size?: string;
    tone?: string;
    disabled?: boolean;
    active?: boolean;
    indicator?: boolean;
  }>(),
  {
    variant: Variant.solid,
    size: Size.md,
    tone: Tone.primary,
    disabled: false,
    active: false,
    indicator: false,
  }
);

const className = computed(() => {
  const variant = props.variant as Variant;
  const tone = props.tone as Tone;
  const size = props.size as Size;
  return computeButtonClasses({
    variant,
    tone,
    size,
    disabled: props.disabled,
    active: props.active,
  });
});
</script>
