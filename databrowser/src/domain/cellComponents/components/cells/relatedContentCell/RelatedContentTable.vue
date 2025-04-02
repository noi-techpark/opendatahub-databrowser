<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell> Id </TableHeaderCell>
      <TableHeaderCell> Type </TableHeaderCell>
    </template>

    <template
      #tableCols="{ item, index }: { item: RelatedContentEntry; index: number }"
    >
      <TableCell>
        <StringCell
          :text="item.id"
          :editable="editable"
          @input="updateItem(index, { id: $event.target.value })"
        />
      </TableCell>
      <TableCell>
        <SelectWithOptionsCell
          v-if="editable"
          :value="item.type"
          :editable="editable"
          :options="relatedContentTypeOptions"
          @update="updateItem(index, { ...item, type: $event.value })"
        />
        <span v-else>{{ getRelatedContentTypeLabel(item.type) }}</span>
      </TableCell>
    </template>
    <template #noItems> No items have been defined yet </template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new Related Content'"
        @click="addItems([{ type: relatedContentTypeDefaultValue }])"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { RelatedContentEntry } from './types';
import StringCell from '../stringCell/StringCell.vue';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import {
  relatedContentTypeOptions,
  relatedContentTypeDefaultValue,
  getRelatedContentTypeLabel,
} from './relatedContentOptions';

defineProps<{ items: RelatedContentEntry[] }>();

const { addItems, updateItem } = useInjectActionTriggers<RelatedContentEntry>();

const { editable } = useInjectEditMode();
</script>
