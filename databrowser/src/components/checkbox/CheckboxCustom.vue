<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex">
    <label
      class="inline-flex cursor-pointer items-center"
      :class="{ 'opacity-50': disabled }"
    >
      <input
        v-model="checked"
        :indeterminate="indeterminate"
        type="checkbox"
        class="size-5 cursor-pointer rounded border-gray-400 text-green-700"
        :disabled="disabled"
        :tabindex="tabbable ? undefined : -1"
      />
      <span v-if="label != null" class="ml-3 font-semibold">{{ label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const checked = defineModel<boolean>({
  default: false,
});

withDefaults(
  defineProps<{
    label?: string;
    tabbable?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
  }>(),
  {
    label: undefined,
    tabbable: true,
    disabled: false,
    indeterminate: false,
  }
);
</script>
