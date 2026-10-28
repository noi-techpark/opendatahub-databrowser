<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    :class="[
      'my-4 flex flex-col divide-y rounded-sm border border-gray-250',
      innerClass ? innerClass : 'mx-2',
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  innerClass?: string;
}>();
</script>
