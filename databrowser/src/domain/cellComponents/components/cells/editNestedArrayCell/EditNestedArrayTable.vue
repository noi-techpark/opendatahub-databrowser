<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- Nested array table container with visual border for clarity -->
  <EditListTable :items="items" :editable="editable" :hide-settings-column="hideSettingsColumn">
    <!-- Define column widths to distribute space evenly -->
    <template #colGroup>
      <col
        v-for="(property, index) in filteredProperties"
        :key="index"
        :class="property.class || getColumnWidthClass()"
      />
    </template>

    <template #tableHeader>
      <TableHeaderCell v-for="(property, index) in filteredProperties" :key="index">
        {{ property.title }}
        <!-- Show deprecation indicator in header if property is deprecated -->
        <span
          v-if="hasDeprecation(property)"
          class="ml-1 text-xs text-deprecated"
          title="Deprecated"
        >⚠</span>
      </TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }">
      <!-- Debug: Log what we're rendering -->
      <template v-if="debugMode">
        {{ logTableRow(item, index) }}
      </template>

      <TableCell v-for="(property, propIndex) in getComputedPropertiesForItem(item)" :key="propIndex">
        <ComponentRenderer
          :tag-name="property.component"
          :attributes="property.value"
          :object-mapping="property.objectMapping"
          :array-mapping="property.arrayMapping"
          :editable="false"
          @update="(update: any) => handleNestedUpdate(index, update, property)"
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
import { DeprecationInfo, PropertyConfig } from '../../../../datasets/config/types';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useToolBoxStore } from '../../../../datasets/ui/toolBox/toolBoxStore';
import { usePropertyComputation } from '../../../../datasets/ui/category/usePropertyComputation';
import { PropertyConfigWithValue } from '../../../../datasets/ui/category/types';

const props = withDefaults(
  defineProps<{
    items?: unknown[] | null;
    properties?: PropertyConfig[];
    pathToParent?: string;
    editable?: boolean;
    // Deprecation info from parent - merged with nested property deprecation
    parentDeprecationInfo?: DeprecationInfo[];
    // Hide settings column (delete, duplicate, navigate actions)
    hideSettingsColumn?: boolean;
  }>(),
  {
    items: () => [],
    properties: () => [],
    pathToParent: '',
    editable: false,
    parentDeprecationInfo: () => [],
    hideSettingsColumn: false,
  }
);

const emit = defineEmits<{
  update: [value: { prop: string; value: unknown[] }];
}>();

const debugMode = computed(() => import.meta.env.DEV);

const toolboxStore = useToolBoxStore();
const { computeProperties } = usePropertyComputation();

/**
 * Get filtered properties for table columns (respects showDeprecated, showReferences).
 * Uses computeProperties with empty data to get the column definitions.
 */
const filteredProperties = computed(() => {
  // Use computeProperties to filter and transform properties
  // Pass empty object since we just need column definitions, not values
  return computeProperties(
    {},
    props.properties,
    true, // showAll - always show columns in table
    props.editable,
    toolboxStore.settings.showDeprecated,
    toolboxStore.settings.showReferences
  );
});

/**
 * Compute property values for a specific item.
 * Returns the computed properties with values for rendering.
 */
const getComputedPropertiesForItem = (item: unknown): PropertyConfigWithValue[] => {
  return computeProperties(
    item,
    props.properties,
    true, // showAll - always show all columns in table
    props.editable,
    toolboxStore.settings.showDeprecated,
    toolboxStore.settings.showReferences
  );
};

/**
 * Check if a property has deprecation (own or inherited from parent)
 */
const hasDeprecation = (property: PropertyConfig | PropertyConfigWithValue): boolean => {
  const parentInfo = props.parentDeprecationInfo ?? [];
  const propertyInfo = property.deprecationInfo ?? [];
  return parentInfo.length > 0 || propertyInfo.length > 0;
};

/**
 * Get column width class based on number of properties.
 * Uses min-width to ensure columns have minimum size but can grow to fill space.
 */
const getColumnWidthClass = (): string => {
  const count = filteredProperties.value?.length ?? 1;
  if (count <= 2) return 'min-w-48 md:min-w-64';
  if (count <= 3) return 'min-w-40 md:min-w-52';
  if (count <= 4) return 'min-w-36 md:min-w-44';
  return 'min-w-32 md:min-w-40';  // 5+ properties: smaller minimum
};

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
    properties: filteredProperties.value.map(p => p.title),
  });
  return null; // Don't render anything
};

/**
 * Handle updates from nested components within array items
 * This merges updates into the correct array item
 */
const handleNestedUpdate = (
  itemIndex: number,
  update: { prop: string; value: unknown },
  property: PropertyConfig | PropertyConfigWithValue
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
  property: PropertyConfig | PropertyConfigWithValue
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
