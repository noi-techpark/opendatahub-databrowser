<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <section>
    <!-- Slot for table visualization -->
    <slot v-if="isCurrentTable" name="table" :items="itemsAsArray"></slot>

    <!-- Slot for tab visualization -->
    <slot v-if="isCurrentTab" name="tab" :items="itemsAsArray"></slot>

    <!-- Slot for add visualization (e.g. upload) -->
    <slot v-if="isCurrentAdd" name="add"></slot>
  </section>
</template>

<script setup lang="ts" generic="T">
import { computed, toRaw } from 'vue';
import { useProvideActions } from './actions/useActions';
import { useProvideNavigation } from './actions/useNavigation';
import { useProvideEditMode } from './actions/useEditMode';

type ItemWithKey = T & Record<string, unknown>;

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{
    items?: Record<string, T> | null;
    keyTargetProperty: string;
    parentKey: string;
    editable?: boolean;
  }>(),
  {
    items: () => ({}),
  }
);

// Convert object to array by adding the key as a property
// Example: { "key1": { "data": "foo" } } becomes [{ "id": "key1", "data": "foo" }]
const itemsAsArray = computed(() => {
  if (props.items == null) {
    return [];
  }

  return Object.entries(props.items).map(([key, value]) => ({
    ...(value as object),
    [props.keyTargetProperty]: key,
  })) as ItemWithKey[];
});

// Convert array back to object by extracting the key property
// Example: [{ "id": "key1", "data": "foo" }] becomes { "key1": { "data": "foo" } }
const arrayToObject = (items: ItemWithKey[]): Record<string, T> => {
  return items.reduce(
    (acc, item) => {
      const key = item[props.keyTargetProperty] as string;

      // Create a copy without the key property
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [props.keyTargetProperty]: _, ...rest } = item;

      acc[key] = rest as T;
      return acc;
    },
    {} as Record<string, T>
  );
};

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
} = useProvideActions<ItemWithKey>();

const editable = computed(() => props.editable === true);
useProvideEditMode(editable);

onAddItems((...items: ItemWithKey[]) => {
  console.log(items)
  const newItems = [...itemsAsArray.value, ...(items ?? [])];
  updateItems(newItems);
  setActiveTab(newItems.length - 1);
});

onDeleteItems((...indexes: number[]) => {
  const indexSet = new Set(indexes);
  const remainingItems = itemsAsArray.value.filter(
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
  const itemToClone = itemsAsArray.value[index];
  let duplicatedEntry = isObject(itemToClone)
    ? // If item to duplicate is an object, unwrap Vue proxy and clone
      structuredClone(toRaw(itemToClone))
    : // Otherwise return the original value
      itemToClone;

  duplicatedEntry = {
    ...duplicatedEntry,
    [props.keyTargetProperty]: ""
  }

  const newItems = [
    ...itemsAsArray.value.slice(0, index + 1),
    duplicatedEntry,
    ...itemsAsArray.value.slice(index + 1),
  ];

  updateItems(newItems);

  if (isCurrentTab.value) {
    navigateToTab(index + 1);
  }
});

onUpdateItem(({ index, item }) => {
  const items = [...itemsAsArray.value];
  items[index] = item;
  updateItems(items);
});

// CRITICAL: Convert array back to object before emitting
// This ensures useUpdate receives the data in the same structure it entered ComponentRenderer
onUpdateItems((...items: ItemWithKey[]) => {
  const itemsAsObject = arrayToObject(items);
  console.log(itemsAsObject)
  emit('update', { prop: props.parentKey, value: itemsAsObject });
});

const isObject = (o: unknown): o is object =>
  typeof o === 'object' && o !== null;
</script>
