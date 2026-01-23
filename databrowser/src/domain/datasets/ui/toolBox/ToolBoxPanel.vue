<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TabPanel tabindex="-1" class="flex h-full flex-col gap-5 overflow-y-auto">
    <slot></slot>
  </TabPanel>
</template>

<script setup lang="ts">
import { TabPanel } from '@headlessui/vue';
</script>
