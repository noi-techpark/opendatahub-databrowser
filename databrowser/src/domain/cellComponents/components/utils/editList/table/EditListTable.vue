<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <EditListActionHeader
      v-if="editable && hasItems && showTableActionHeader"
      class="mb-5 mt-2 flex justify-between gap-5 md:justify-end"
      :class="anyItemSelected ? 'text-default' : 'text-disabled'"
      delete-label="Delete"
      :any-item-selected="anyItemSelected"
      @confirm-delete="deleteSelectedItems"
    >
      <template #addItems>
        <slot name="addItems"></slot>
      </template>
    </EditListActionHeader>
    <TableCustom v-if="hasItems" class="mb-5 overflow-y-auto">
      <colgroup>
        <template v-if="editable && hasItems">
          <col v-if="showSortableColumn" class="w-0 md:w-10" />
          <col v-if="showSelectCheckbox" class="w-10 md:w-20" />
        </template>

        <!-- Slot for colgroup -->
        <slot name="colGroup"></slot>

        <col v-if="showSettingsColumn" class="w-20 md:w-28" />
      </colgroup>

      <TableHeader>
        <template v-if="editable && hasItems">
          <!-- Column for Drag/Drop -->
          <TableHeaderCell
            v-if="showSortableColumn"
            class="w-0 border-none bg-white md:w-full"
          >
            &nbsp;
          </TableHeaderCell>
          <!-- Column for checkbox selection -->
          <TableHeaderCell
            v-if="showSelectCheckbox">
            <div class="flex">
              <CheckboxCustom
                :model-value="allItemsSelected"
                class="mr-3"
                @update:model-value="toggleAllItemsSelected($event)"
              />
              <span class="hidden md:inline">ALL</span>
            </div>
          </TableHeaderCell>
        </template>

        <!-- Slot for table header -->
        <slot name="tableHeader"></slot>

        <!-- Column for settings -->
        <TableHeaderCell
          v-if="showSettingsColumn"
          class="sticky right-0 bg-gray-50 font-semibold"
        >
          Settings
        </TableHeaderCell>
      </TableHeader>
      <VueDraggableNext
        v-model="itemsInternal"
        tag="tbody"
        handle=".handle"
        class="divide-y divide-gray-200"
      >
        <tr v-for="(item, index) in itemsInternal" :key="index">
          <template v-if="editable && hasItems">
            <td v-if="showSortableColumn" class="border-none px-4 pt-4">
              <IconDragAndDrop class="handle hidden cursor-pointer md:block" />
            </td>
            <TableCell class="relative" v-if="showSelectCheckbox">
              <CheckboxCustom
                :model-value="itemsSelected[index]"
                @change="toggleSingleItemSelection(index)"
              />
            </TableCell>
          </template>

          <!-- Slot for table cols -->
          <slot name="tableCols" :item="item" :index="index"></slot>

          <TableCell
            v-if="showSettingsColumn"
            class="sticky right-0 bg-white shadow-table-static-col"
          >
            <ItemActions
              v-if="deleteConfirmIndex !== index"
              :hide-tab-link="hideTabLink"
              @delete="openDeleteSingleItemConfirm(index)"
              @duplicate="duplicateItem(index)"
              @push="pushItem(index)"
              @navigate-to-tab="navigateToTab(index)"
            />
            <ConfirmDeleteSingle
              v-else
              class="inset-x-0 top-0 ml-[-16em] h-full bg-gray-50 p-4 shadow-table-static-col"
              @abort="closeDeleteSingleItemConfirm"
              @confirm="deleteSingleConfirm(index)"
            />
          </TableCell>
        </tr>
      </VueDraggableNext>
    </TableCustom>
    <div v-if="!hasItems" class="mb-5">
      <slot name="noItems"></slot>
    </div>
    <slot v-if="editable" name="addItems"></slot>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';
import TableHeaderCell from '../../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../../components/table/TableCell.vue';
import CheckboxCustom from '../../../../../../components/checkbox/CheckboxCustom.vue';
import IconDragAndDrop from '../../../../../../components/svg/IconDragAndDrop.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import TableCustom from '../../../../../../components/table/TableCustom.vue';
import TableHeader from '../../../../../../components/table/TableHeader.vue';
import { useItemSelection } from './useItemSelection';
import ConfirmDeleteSingle from './ConfirmDeleteSingle.vue';
import ItemActions from './ItemActions.vue';
import EditListActionHeader from '../header/EditListActionHeader.vue';
import { useInjectNavigation } from '../actions/useNavigation';
import { useInjectActionTriggers } from '../actions/useActions';
import { useInjectEditMode } from '../actions/useEditMode';

const props = defineProps<{
  items: T[] | null;
  hideTabLink?: boolean;
  hideSortable?: boolean;
  hideSettingsColumn?: boolean;
  hideSelectCheckbox?: boolean;
  hideTableActionHeader?: boolean;
}>();

// Inject navigation from an ancestor component
const { navigateToTab } = useInjectNavigation();

const { editable } = useInjectEditMode();

const itemsInternal = computed({
  get: () => (props.items != null ? props.items : []),
  set: (value) => updateItems(value),
});

const hasItems = computed(() => itemsInternal.value.length > 0);

const showSortableColumn = computed(() => !props.hideSortable);

const showSelectCheckbox = computed(() => !props.hideSelectCheckbox);

const showTableActionHeader = computed(() => !props.hideTableActionHeader);

const showSettingsColumn = computed(() => {
  if (!hasItems.value || props.hideSettingsColumn) {
    return false;
  }

  return editable.value || !props.hideTabLink;
});

const {
  allItemsSelected,
  anyItemSelected,
  itemsSelected,
  toggleAllItemsSelected,
  toggleSingleItemSelection,
} = useItemSelection(itemsInternal);

const { deleteItems, duplicateItem, pushItem, updateItems } =
  useInjectActionTriggers<T>();

const deleteSelectedItems = () => {
  const indexes = itemsSelected.value.reduce<number[]>(
    (previous, currentSelected, index) =>
      currentSelected ? [...previous, index] : [...previous],
    []
  );
  deleteItems(indexes);
};

const deleteConfirmIndex = ref<number | undefined>();

const openDeleteSingleItemConfirm = (index: number) =>
  (deleteConfirmIndex.value = index);

const closeDeleteSingleItemConfirm = () =>
  (deleteConfirmIndex.value = undefined);

const deleteSingleConfirm = (index: number) => {
  closeDeleteSingleItemConfirm();
  deleteItems([index]);
};
</script>
