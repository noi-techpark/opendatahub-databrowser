<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    :class="{
      [containerClasses]: useContainerClasses && !description,
      'rounded border': description,
      [`border-${activeColorClass} overflow-hidden`]: active,
    }"
  >
    <div
      :class="{
        [wrapperClasses]: useWrapperClasses,
        [customWrapperClasses]: !!customWrapperClasses,
      }"
    >
      <div class="flex items-center gap-4">
        <slot name="toggle" />
        <div
          class="truncate text-sm"
          :class="{
            [customTextClasses]: !!customTextClasses,
          }"
        >
          {{ label }}
        </div>
        <span
          v-if="hasBullet"
          class="h-2 w-2 rounded-full bg-deprecated"
        ></span>
      </div>

      <slot name="info" />
    </div>
    <div v-if="!!description" class="bg-white p-4 font-mono text-xs">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { containerClasses, wrapperClasses } from './fieldsToggleStyles';

withDefaults(
  defineProps<{
    label: string;
    active: boolean;
    description?: string;
    activeColorClass?: string;
    useContainerClasses?: boolean;
    useWrapperClasses?: boolean;
    customWrapperClasses?: string;
    customTextClasses?: string;
    hasBullet?: boolean;
  }>(),
  {
    description: '',
    activeColorClass: '',
    useContainerClasses: true,
    useWrapperClasses: true,
    customWrapperClasses: '',
    customTextClasses: '',
    hasBullet: false,
  }
);
</script>
