<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :editable="editable">
    <template #tableHeader>
      <TableHeaderCell v-for="(property, index) in properties" :key="index">
        {{ property.title }}
      </TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }">
      <!-- Debug: Log what we're rendering -->
      <template v-if="debugMode">
        {{ logTableRow(item, index) }}
      </template>

      <TableCell v-for="(property, propIndex) in properties" :key="propIndex">
        <ComponentRenderer
          :tag-name="property.component"
          :attributes="computePropertyAttributes(item, property)"
          :object-mapping="property.objectMapping"
          :array-mapping="property.arrayMapping"
          :editable="false"
          @update="(update) => handleNestedUpdate(index, update, property)"
        />
      </TableCell>
    </template>

    <template #noItems>
      <slot name="noItems">
        <div class="p-4 text-gray-500">No items have been added yet.</div>
      </slot>
    </template>

    <template v-if="editable" #addItems>
      <slot name="addItems">
        <!-- Default add button if no custom slot provided -->
        <EditListAddButton
          :text="'Add new item'"
          @click="addNewItem"
        />
      </slot>
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as R from 'ramda';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import ComponentRenderer from '../../../../../components/componentRenderer/ComponentRenderer.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { PropertyConfig } from '../../../../datasets/config/types';
import { buildTargetFromMapping } from '../../../../datasets/config/mapping/utils';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';

const props = withDefaults(
  defineProps<{
    items?: unknown[] | null;
    properties?: PropertyConfig[];
    pathToParent?: string;
    editable?: boolean;
    debug?: boolean;
  }>(),
  {
    items: () => [],
    properties: () => [],
    pathToParent: '',
    editable: false,
    debug: false,
  }
);

const emit = defineEmits<{
  update: [value: { prop: string; value: unknown[] }];
}>();

const debugMode = computed(() => true);

// Get navigation and action triggers from EditListCell context
const { navigateToTab } = useInjectNavigation();
const { addItems } = useInjectActionTriggers<unknown>();

/**
 * Add a new empty item to the array
 */
const addNewItem = () => {
  // Add an empty object as a new item
  addItems([{}]);
  // Navigate to the newly added item
  navigateToTab(props.items?.length ?? 0);
};

const logTableRow = (item: unknown, index: number) => {
  console.log('[EditNestedArrayTable] Rendering row:', {
    index,
    item,
    properties: props.properties.map(p => p.title),
  });
  return null; // Don't render anything
};

/**
 * Extract values for a specific property from an array item
 * Uses the same buildTargetFromMapping logic as the rest of the system
 */
const computePropertyAttributes = (
  item: unknown,
  property: PropertyConfig
): Record<string, unknown> => {
  const result = buildTargetFromMapping(item, property);

  if (debugMode.value) {
    console.log('[EditNestedArrayTable] computePropertyAttributes:', {
      property: property.title,
      item,
      result,
    });
  }

  return result;
};

/**
 * Handle updates from nested components within array items
 * This merges updates into the correct array item
 */
const handleNestedUpdate = (
  itemIndex: number,
  update: { prop: string; value: unknown },
  property: PropertyConfig
) => {
  if (debugMode.value) {
    console.log('[EditNestedArrayTable] handleNestedUpdate:', {
      itemIndex,
      update,
      property: property.title,
      currentItems: props.items,
    });
  }

  const currentItems = props.items ?? [];

  // Map the component prop back to the data path
  const dataPath = getDataPathFromUpdate(update.prop, property);

  if (dataPath == null) {
    console.warn(
      `[EditNestedArrayTable] Could not determine data path for property "${update.prop}"`,
      { property, update }
    );
    return;
  }

  // Create updated array with the change applied to the specific item
  const updatedItems = currentItems.map((item, index) => {
    if (index !== itemIndex) {
      return item; // Unchanged items
    }

    // Apply update to this specific item using Ramda's assocPath
    const pathArray = dataPath.split('.');
    const updatedItem = R.assocPath(pathArray, update.value, item);

    if (debugMode.value) {
      console.log('[EditNestedArrayTable] Item updated:', {
        index: itemIndex,
        path: dataPath,
        oldItem: item,
        newItem: updatedItem,
      });
    }

    return updatedItem;
  });

  // Emit update with full array
  emit('update', { prop: props.pathToParent, value: updatedItems });
};

/**
 * Map component prop back to data path using the property's mapping configuration
 * This is the inverse of buildTargetFromMapping
 */
const getDataPathFromUpdate = (
  updateProp: string,
  property: PropertyConfig
): string | null => {
  // For object mapping, find which data path corresponds to this prop
  if (property.objectMapping != null) {
    const dataPath = property.objectMapping[updateProp];
    if (dataPath) {
      return dataPath;
    }
  }

  // For array mapping, the prop is the pathToParent
  if (property.arrayMapping != null) {
    return property.arrayMapping.pathToParent;
  }

  return null;
};
</script>
