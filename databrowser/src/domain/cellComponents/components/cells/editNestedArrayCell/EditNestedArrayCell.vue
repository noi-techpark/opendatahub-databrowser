<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="items" :editable="editable" @update="handleUpdate">
    <!-- Table view: Show summary of items -->
    <template #table="{ items: tableItems }">
      <EditNestedArrayTable
        :items="tableItems"
        :properties="properties"
        :path-to-parent="pathToParent"
        :editable="editable"
        :parent-deprecation-info="parentDeprecationInfo"
        @update="handleUpdate"
      />
    </template>

    <!-- Tab view: Render nested properties for each item -->
    <template #tab="{ items: tabItems }">
      <EditNestedArrayTab
        :items="tabItems"
        :properties="properties"
        :path-to-parent="pathToParent"
        :editable="editable"
        :parent-deprecation-info="parentDeprecationInfo"
        @update="handleUpdate"
      />
    </template>

    <!-- Add view: Can be used for uploading or bulk adding -->
    <template #add>
      <slot name="add">
        <div class="p-4 text-gray-500">
          Add functionality not implemented for this array type.
        </div>
      </slot>
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { DeprecationInfo, PropertyConfig } from '../../../../datasets/config/types';
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditNestedArrayTable from './EditNestedArrayTable.vue';
import EditNestedArrayTab from './EditNestedArrayTab.vue';

const props = withDefaults(
  defineProps<{
    items?: unknown[] | null;
    properties?: PropertyConfig[];
    pathToParent?: string;
    editable?: boolean;
    // Deprecation info from parent - propagated to nested properties
    parentDeprecationInfo?: DeprecationInfo[];
  }>(),
  {
    items: () => [],
    properties: () => [],
    pathToParent: '',
    editable: false,
    parentDeprecationInfo: () => [],
  }
);

const emit = defineEmits<{
  update: [value: { prop: string; value: unknown[] }];
}>();

/**
 * Handle updates from the EditListCell (add, delete, duplicate operations)
 */
const handleUpdate = (update: { prop: string; value: unknown[] }) => {
  console.log('[EditNestedArrayCell] handleUpdate:', update);

  // Pass through to parent with pathToParent
  emit('update', { prop: props.pathToParent, value: update.value });
};
</script>
