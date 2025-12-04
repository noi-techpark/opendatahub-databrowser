<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <section>
    <!-- Slot for table visualization -->
    <slot v-if="isCurrentTable" name="table" :items="itemsInternal"></slot>

    <!-- Slot for tab visualization -->
    <slot v-if="isCurrentTab" name="tab" :items="itemsInternal"></slot>

    <!-- Slot for add visualization (e.g. upload) -->
    <slot v-if="isCurrentAdd" name="add"></slot>
  </section>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue';
import { useProvideActions } from './actions/useActions';
import { useProvideNavigation } from './actions/useNavigation';
import { useProvideEditMode } from './actions/useEditMode';

const emit = defineEmits(['update']);

const props = defineProps<{
  items?: T[] | null;
  editable?: boolean;
}>();

// Use internal copy of items for quicker operations (e.g. sorting)
// The internal copy is also updated in case the items prop updates
const itemsInternal = computed(() => (props.items != null ? props.items : []));

// Provide navigation to this component and the component's descendants
const {
  isCurrentAdd,
  isCurrentTab,
  isCurrentTable,
  navigateToTab,
  navigateToTable,
  setActiveTab,
} = useProvideNavigation();

// Provide action handling to this component and the component's descendants
const {
  onAddItems,
  onDeleteAllItems,
  onDeleteItems,
  onDuplicateItem,
  onUpdateItem,
  onUpdateItems,
  updateItems,
} = useProvideActions<T>();

const editable = computed(() => props.editable === true);
useProvideEditMode(editable);

onAddItems((...items: T[]) => {
  const newItems = [...itemsInternal.value, ...(items ?? [])];
  updateItems(newItems);
  setActiveTab(newItems.length - 1);
});

onDeleteItems((...indexes: number[]) => {
  const indexSet = new Set(indexes);
  const remainingItems = itemsInternal.value.filter(
    (item, index) => !indexSet.has(index)
  );
  updateItems(remainingItems);
  if (remainingItems.length === 0) {
    navigateToTable();
  }
});

onDeleteAllItems(() => {
  updateItems([]);
  navigateToTable();
});

onDuplicateItem((index: number) => {
  const duplicatedEntry = isObject(itemsInternal.value[index])
    ? // If item to duplicate is an object, create a new object with the same properties
      structuredClone(itemsInternal.value[index])
    : // Otherwise return the original value
      itemsInternal.value[index];

  const newItems = [
    ...itemsInternal.value.slice(0, index + 1),
    duplicatedEntry,
    ...itemsInternal.value.slice(index + 1),
  ];

  updateItems(newItems);

  if (isCurrentTab.value) {
    navigateToTab(index + 1);
  }
});

onUpdateItem(({ index, item }) => {
  const items = [...itemsInternal.value];
  items[index] = item;
  updateItems(items);
});

onUpdateItems((...items: T[]) => {
  emit('update', { prop: 'items', value: items });
});

const isObject = (o: unknown): o is object =>
  typeof o === 'object' && o !== null;
</script>
