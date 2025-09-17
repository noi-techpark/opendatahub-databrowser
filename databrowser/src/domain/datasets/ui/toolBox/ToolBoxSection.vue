<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
  <slot />
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  sectionKey: string; // meglio evitare `key` perché è una parola speciale di Vue
  title: string;
  iconComponent?: Component;
  info?: string;
}>();
</script>
