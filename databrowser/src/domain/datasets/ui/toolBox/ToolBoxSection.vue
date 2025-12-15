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
  sectionKey: string;
  title: string;
  iconComponent?: Component;
  infoComponent?: Component;
  info?: string;
}>();
</script>
