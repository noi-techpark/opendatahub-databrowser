<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div
      class="pointer-events-all inset-0"
      :class="{
        'fixed z-50 bg-dialog/60 md:static md:bg-transparent': active,
      }"
      @click="$emit('overlayClick')"
    ></div>

    <div
      :class="{
        'absolute inset-x-0 top-0 z-60 bg-white p-2': active,
      }"
      @click.stop="null"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ active?: boolean }>();

defineEmits(['overlayClick']);
</script>
