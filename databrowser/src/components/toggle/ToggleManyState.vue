<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="inline-block rounded-full border border-green-500 text-xs">
    <button
      v-for="(option, index) in options"
      :key="index"
      :disabled="disabled"
      :aria-pressed="valueMatchesModel(option.value)"
      :aria-label="`Set to ${option.label}`"
      class="m-px inline-block rounded-full px-3 py-[2px]"
      :class="[
        {
          'bg-green-500 text-white':
            !disabled && valueMatchesModel(option.value),
          'text-green-500': !disabled && !valueMatchesModel(option.value),
          'bg-gray-500 text-white': disabled && valueMatchesModel(option.value),
          'text-gray-500': disabled && !valueMatchesModel(option.value),
          'focus:outline-hidden': valueMatchesModel(option.value),
        },
      ]"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ToggleManyStateOption } from './types';

const model = defineModel<unknown>();

withDefaults(
  defineProps<{
    options: ToggleManyStateOption[];
    disabled?: boolean;
  }>(),
  { disabled: false }
);

const valueMatchesModel = (value: unknown) => {
  // TODO: check if we need implicit type conversion for undefined and null
  //   // If the model value is null or undefined, we need to
  //   // compare with an implicit type conversion.
  //   if (model.value === null || model.value === undefined) {
  //     return value == model.value;
  //   }
  // Otherwise, we can use strict equality.
  return value === model.value;
};
</script>
