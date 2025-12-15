<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="h-3 w-3 mx-[1px]"
    :class="{
          'bg-green-500': color === 'green',
          'bg-red-500': color === 'red',
          'bg-gray-300': color === 'gray',
        }"
  />
</template>

<script setup lang="ts">
defineProps<{
  color: 'green' | 'red' | 'gray';
}>();
</script>

<style scoped>
</style>
