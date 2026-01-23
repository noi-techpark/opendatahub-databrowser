<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->


<template>
  <slot />
</template>

<script setup lang="ts">
/**
 * This component is intentionally "renderless".
 * It acts as wrapper for the available sections inside a sidebar ToolBox (i.e DetailViewToolBox.vue and TableViewToolBox.vue).
 */

import type { Component } from 'vue';

defineProps<{
  sectionKey: string;
  title: string;
  iconComponent?: Component;
  infoComponent?: Component;
}>();
</script>
