<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #body="{ item, index }">
      <div class="space-y-4">
        <!-- Debug: Show what we have -->
        <div v-if="debugMode" class="rounded border border-yellow-300 bg-yellow-50 p-4">
          <div class="font-bold">Debug Info:</div>
          <div>Item index: {{ index }}</div>
          <div>Properties count: {{ properties.length }}</div>
          <div>Item data: {{ JSON.stringify(item).substring(0, 200) }}...</div>
        </div>

        <!-- Render each nested property as a SubCategoryItem -->
        <SubCategoryItem
          v-for="(property, propIndex) in properties"
          :key="`${index}-${propIndex}`"
          :title="property.title"
          :tooltip="property.tooltip"
        >
          <ComponentRenderer
            :tag-name="property.component"
            :attributes="computePropertyAttributes(item, property)"
            :object-mapping="property.objectMapping"
            :array-mapping="property.arrayMapping"
            :editable="editable"
            @update="(update) => handleNestedUpdate(index, update, property)"
          />
        </SubCategoryItem>
      </div>
    </template>

    <template #tabLabel="{ index }">
      <span> Element {{ index + 1 }}</span>
    </template>

    <template v-if="editable" #addItems>
      <EditListAddButton
        :text="'Add new item'"
        @click="addNewItem"
      />
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as R from 'ramda';
import ComponentRenderer from '../../../../../components/componentRenderer/ComponentRenderer.vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
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
  // Navigate to the newly added item's tab
  navigateToTab(props.items?.length ?? 0);
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
    console.log('[EditNestedArrayTab] computePropertyAttributes:', {
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
    console.log('[EditNestedArrayTab] handleNestedUpdate:', {
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
      `[EditNestedArrayTab] Could not determine data path for property "${update.prop}"`,
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
      console.log('[EditNestedArrayTab] Item updated:', {
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
