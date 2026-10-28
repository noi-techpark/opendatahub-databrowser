<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="relative z-9 flex items-center">
    <ButtonCustom
      size="xs"
      variant="ghost"
      :disabled="disabled"
      :active="active"
      class="flex h-11 items-center justify-center px-2 text-center text-base"
      @click="emit('click')"
    >
      <component :is="icon" v-if="icon" class="mx-1.5 size-4 text-green-400" />
      <span class="ml-1 hidden text-gray-950 md:flex">{{ label }}</span>

      <span
        v-if="hasBullet"
        class="absolute top-2 right-3 h-1 w-1 rounded-full bg-green-700"
      ></span>
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ButtonCustom from '@/components/button/ButtonCustom.vue';

withDefaults(
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
    icon: null,
  }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
