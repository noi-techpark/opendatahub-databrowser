<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <CheckboxCustom
      v-if="publishers.length > 1"
      :model-value="selected.every((item) => item === true)"
      :disabled="disabled"
      label="All"
      @update:model-value="toggleAll($event)"
    />
    <CheckboxCustom
      v-for="(item, index) in selected"
      :key="`${index}-${item}`"
      :model-value="selected[index]"
      :label="publishers[index].name"
      :disabled="disabled || publishers.length === 1"
      @click="selected[index] = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import CheckboxCustom from '../../../../../components/checkbox/CheckboxCustom.vue';
import { Publisher } from './types';

const emit = defineEmits(['selectionChange']);

const props = defineProps<{ publishers: Publisher[]; disabled: boolean }>();

// Initialize the selected array booleans with the same length as the publishers array
// When a checkbox is clicked, the corresponding index in the selected array is toggled
const selected = reactive(
  props.publishers.length === 1
    ? [true]
    : [...Array(props.publishers.length)].map(() => false)
);

const toggleAll = (event: boolean) =>
  // We need to update the selected array in the next tick to avoid reactivity issues
  // where the 'Toggle All' checkbox is not updated correctly
  setTimeout(
    () => selected.forEach((_, index) => (selected[index] = event)),
    0
  );

// Array of selected publishers that is updated when the component properties
// change or when the user selects a publisher
const selectedPublishers = ref<Publisher[]>([]);

// Update the selected publishers when the component properties change
watch(
  () => props.publishers,
  () =>
    (selectedPublishers.value =
      props.publishers.length === 1 ? [props.publishers[0]] : [])
);

// Update the selected publishers when the publishers change
const updateSelection = (selected: boolean[]) => {
  selectedPublishers.value = props.publishers.filter(
    (_, index) => selected[index]
  );
  emit('selectionChange', selectedPublishers.value);
};

// Update selection when the selected array changes
watch(
  () => selected,
  () => updateSelection(selected),
  { immediate: true, deep: true }
);
</script>
