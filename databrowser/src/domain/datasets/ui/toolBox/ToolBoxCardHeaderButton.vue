<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <button
    class="rounded text-green-500 outline-offset-1"
    @click="$emit('icon-click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineEmits(['icon-click']);
</script>

<style scoped>
:slotted(svg) {
  @apply h-4 w-4;
}
</style>
