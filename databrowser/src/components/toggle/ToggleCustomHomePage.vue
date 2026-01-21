<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToggleCustom v-model="turnedOn" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import ToggleCustom from './ToggleCustom.vue';

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    disabled?: boolean;
    filterKey?: string;
    filterSelected?: { key: string; value: string }[];
  }>(),
  {
    modelValue: true,
    disabled: false,
    filterKey: '',
    filterSelected: () => [],
  }
);

const turnedOn = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(
  () => props.filterSelected,
  (newFilterSelected) => {
    turnedOn.value = newFilterSelected.some(
      (filter) => filter.key === props.filterKey
    );
  },
  { immediate: true }
);
</script>
