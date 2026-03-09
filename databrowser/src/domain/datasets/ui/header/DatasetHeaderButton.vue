<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="z-9 relative flex items-center">
    <ButtonCustom
        size="xs"
        variant="ghost"
        :disabled="disabled"
        :active="active"
        class="h-11 px-2 text-center text-base flex items-center justify-center"
        @click="emit('click')"
    >
      <component :is="icon" v-if="icon" class="text-green-400 mx-1.5 size-4" />
      <span class="hidden text-gray-950 ml-1 md:flex">{{ label }}</span>

      <span
          v-if="hasBullet"
          class="absolute right-3 top-2 h-1 w-1 rounded-full bg-green-700"
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
      icon: null
    }
);

const emit = defineEmits<{
  (e: 'click'): void;
}>();

</script>
