<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="z-9 relative flex h-11 items-center border rounded-sm-plus
           px-2 text-base transition
           hover:border-green-400 hover:bg-green-400/10"
    :class="computedClasses"
  >
    <component :is="icon" v-if="icon" class="text-green-400 mx-1.5 size-4" />

    <span class="hidden text-gray-950 ml-1 md:flex">
      {{ label }}
    </span>

    <span
      v-if="hasBullet"
      class="absolute right-3 top-2 h-1 w-1 rounded-full bg-green-700"
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
    props.active ? 'border-green-400 bg-green-400/10' : 'border-lightgray'
  ].join(' ');
});
</script>
