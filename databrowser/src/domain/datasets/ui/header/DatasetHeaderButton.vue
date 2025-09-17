<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="z-9 relative flex items-center">
    <ButtonCustom
        size="xs"
        variant="ghost"
        :disabled="props.disabled"
        :active="props.active"
        class="hidden h-11 px-2 text-center text-base md:flex md:items-center md:justify-center"
        @click="props.handler()"
    >
      <component :is="props.icon" v-if="props.icon" class="text-green-400 ml-1 mr-2 size-4" />
      {{ props.label }}

      <span
          v-if="props.hasBullet"
          class="absolute right-3 top-2 h-1 w-1 rounded-full bg-green-700"
      ></span>
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import ButtonCustom from '@/components/button/ButtonCustom.vue';

const props = withDefaults(
    defineProps<{
      label: string | null;
      active?: boolean;
      disabled?: boolean;
      hasBullet?: boolean;
      icon?: Component | null;
      handler: () => void;
    }>(),
    {
      active: false,
      disabled: false,
      icon: null
    }
);
</script>
