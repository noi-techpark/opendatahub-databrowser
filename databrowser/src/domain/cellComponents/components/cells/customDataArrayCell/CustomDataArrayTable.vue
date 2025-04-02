<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-80" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Name</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }: { item: string; index: number }">
      <TableCell>
        <SelectWithOptionsCell
          v-if="editable"
          :options="getOptionsForItem(item)"
          :value="item"
          :show-empty-value="item == null"
          :editable="editable"
          :show-add-new-value="true"
          :show-value-as-label-fallback="true"
          @update="updateItem(index, $event.value)"
        />
        <!-- Show translated label if not in edit mode -->
        <span v-else>{{ getLabelForItem(item) }}</span>
      </TableCell>
    </template>
    <template #noItems>No tags have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new'" @click="addItems([''])" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { SelectOption } from '../../../../../components/select/types';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';

const props = defineProps<{
  items: string[];
  options: SelectOption[];
}>();

const { items } = toRefs(props);

const { addItems, updateItem } = useInjectActionTriggers<string>();

const { editable } = useInjectEditMode();

const getOptionsForItem = (tag: string) => {
  const allOptions = props.options.map((option) => ({
    ...option,
    selected: tag === option.value,
  }));

  return allOptions;
};

const getLabelForItem = (item: string) =>
  props.options.find((option) => option.value === item)?.label ?? item;
</script>
