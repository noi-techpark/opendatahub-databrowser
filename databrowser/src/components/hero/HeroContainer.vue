<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="bg-gray-100">
    <ContentAlignmentX
      class="m-auto flex flex-col items-start px-4 pt-6 pb-8 xl:w-default 2xl:px-0"
    >
      <slot></slot>
    </ContentAlignmentX>
  </header>
</template>

<script setup lang="ts">
import ContentAlignmentX from '../content/ContentAlignmentX.vue';
</script>
