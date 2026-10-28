<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex items-center justify-between bg-white p-4 font-semibold"
    :class="{ uppercase: uppercase }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ uppercase?: boolean }>(), { uppercase: true });
</script>
