<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="relative z-9 flex h-11 items-center rounded border px-2 text-base transition hover:border-green-400 hover:bg-green-400/10"
    :class="computedClasses"
  >
    <component :is="icon" v-if="icon" class="mx-1.5 size-4 text-green-400" />

    <span class="ml-1 hidden text-gray-950 md:flex">
      {{ label }}
    </span>

    <span
      v-if="hasBullet"
      class="absolute top-2 right-3 h-1 w-1 rounded-full bg-green-700"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string | null;
    active?: boolean;
    disabled?: boolean;
    hasBullet?: boolean;
    icon?: Component | null;
  }>(),
  {
    active: false,
    disabled: false,
    hasBullet: false,
    icon: null,
  }
);

const computedClasses = computed(() => {
  return [
    props.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
    props.active ? 'border-green-400 bg-green-400/10' : 'border-lightgray',
  ].join(' ');
});
</script>
