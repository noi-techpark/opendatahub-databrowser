<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Updated On</TableHeaderCell>
      <TableHeaderCell>Update Source</TableHeaderCell>
      <TableHeaderCell>Updated By</TableHeaderCell>      
    </template>

    <template #tableCols="{ item }: { item: UpdateHistoryEntry }">           
      <TableCell>
        <EditedDateCell :date="item.LastUpdate"  />
      </TableCell>
      <TableCell>{{ item.UpdateSource }}</TableCell>
      <TableCell>{{ item.UpdatedBy }}</TableCell>      
    </template>
    <template #noItems>No items have been defined yet</template>    
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { UpdateHistoryEntry } from './types';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import DateCell from '../dateCell/DateCell.vue';
import EditedDateCell from '../editedDateCell/EditedDateCell.vue';

defineProps<{ items: UpdateHistoryEntry[] }>();

const { addItem } = useInjectActionTriggers<UpdateHistoryEntry>();

const { editable } = useInjectEditMode();
</script>
