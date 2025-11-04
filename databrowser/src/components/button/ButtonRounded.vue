<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- class="rounded-full border-none text-green-500 hover:border-green-500 hover:bg-green-500 hover:text-white focus-visible:border-green-500 focus-visible:bg-green-500/10 focus-visible:text-green-500 focus-visible:outline-none" -->
  <button
    class="rounded-full border-none"
    :class="[classes, { 'cursor-not-allowed opacity-50': disabled }]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    solid?: boolean;
    disabled?: boolean;
  }>(),
  {
    solid: true,
    disabled: false,
  }
);

const classes = computed(() => {
  return {
    'bg-green-500 text-white hover:bg-green-400 focus-visible:bg-green-500/70 focus-visible:outline-none':
      props.solid,
    'bg-transparent text-green-500 hover:bg-green-500/10  focus-visible:border-green-500 focus-visible:bg-green-500/10 focus-visible:text-green-500 focus-visible:outline-none':
      !props.solid,
  };
});
</script>
