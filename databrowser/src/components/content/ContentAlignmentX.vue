<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div :class="['mx-auto w-full', noPadding ? '' : 'px-4']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ noPadding?: boolean }>()
</script>
