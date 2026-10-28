<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between"
  >
    <component
      :is="tagName"
      class="flex justify-between text-xl leading-tight font-semibold lg:text-2xl"
    >
      <slot></slot>
    </component>
    <slot name="right"></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    tagName?: string;
  }>(),
  {
    tagName: 'h5',
  }
);
</script>
