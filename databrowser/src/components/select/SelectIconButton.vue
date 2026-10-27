<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ListboxButton
    v-slot="{ open }"
    class="relative flex w-full items-center justify-between truncate rounded-sm border border-lightgray px-2 py-2 text-left leading-tight hover:border-green-400 hover:bg-green-400/10 md:px-3"
  >
    <!-- Parte sinistra: icona + testi -->
    <div class="flex items-center gap-1 md:gap-2">
      <component
        v-if="iconComponent"
        :is="iconComponent"
        class="size-4 shrink-0 text-green-400"
      />
      <div class="flex flex-col">
        <span
          class="hidden text-sm text-gray-950 md:flex"
          :title="selectedElementLabel"
        >
          {{ selectedElementLabel }}
        </span>
        <span class="hidden text-xs text-dialog md:flex" :title="label">
          {{ label }}
        </span>
      </div>
    </div>

    <!-- Freccetta a dx -->
    <span class="pointer-events-none flex items-center">
      <IconStrokedArrowDown v-if="!open" class="size-5 stroke-current" />
      <IconStrokedArrowUp v-else class="size-5 stroke-current" />
    </span>
  </ListboxButton>
</template>

<script setup lang="ts">
import { ListboxButton } from '@headlessui/vue';
import IconStrokedArrowDown from '../svg/IconStrokedArrowDown.vue';
import IconStrokedArrowUp from '../svg/IconStrokedArrowUp.vue';
import type { Component } from 'vue';

defineProps<{
  label: string;
  selectedElementLabel: string;
  iconComponent?: Component;
}>();
</script>
