<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ListboxButton
    v-slot="{ open }"
    class="relative w-full truncate bg-white border border-gray-300 pl-2 pr-9 text-left leading-tight"
  >
    <span :title="label">{{ label }}</span>
    <span
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
    >
      <IconStrokedArrowDown v-if="!open" class="size-5 stroke-current" />
      <IconStrokedArrowUp v-else class="size-5 stroke-current" />
    </span>
  </ListboxButton>
</template>

<script setup lang="ts">
import { ListboxButton } from '@headlessui/vue';
import IconStrokedArrowDown from '../svg/IconStrokedArrowDown.vue';
import IconStrokedArrowUp from '../svg/IconStrokedArrowUp.vue';

defineProps<{ label: string }>();
</script>
