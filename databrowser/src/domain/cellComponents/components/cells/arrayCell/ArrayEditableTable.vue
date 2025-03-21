<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Name</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }">
      <TableCell>
        <StringCell
          v-if="!hasOptions"
          :text="item"
          :editable="editable"
          @update="updateItem(index, $event.value)"
        />
        <SelectWithOptionsCell
          v-else
          :options="options"
          :value="item"
          :editable="editable"
          @update="updateItem(index, $event.value)"
        />
      </TableCell>
    </template>
    <template #noItems>No items have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new item'" @click="addItems([''])" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import StringCell from '../stringCell/StringCell.vue';
import { SelectOption } from '../../../../../components/select/types';
import { computed } from 'vue';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';

const props = defineProps<{
  items: string[];
  options?: SelectOption[];
}>();

const { editable } = useInjectEditMode();

const hasOptions = computed(
  () => props.options != null && props.options.length > 0
);

const { addItems, updateItem } = useInjectActionTriggers<string>();
</script>
