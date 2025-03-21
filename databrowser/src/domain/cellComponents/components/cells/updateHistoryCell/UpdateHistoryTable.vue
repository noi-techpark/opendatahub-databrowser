<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hideTabLink="true" :hideSettingsColumn="true" :hideSortable="true" :hideSelectCheckbox="true" :hideTableActionHeader="true">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-80" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Updated On</TableHeaderCell>
      <TableHeaderCell>Updated By</TableHeaderCell> 
      <TableHeaderCell>Update Source</TableHeaderCell>     
    </template>

    <template #tableCols="{ item }: { item: UpdateHistoryEntry }">           
      <TableCell>
        <EditedDateCell :date="item.LastUpdate" :format="'dd/MM/yyyy HH:mm'" />
      </TableCell>
      <TableCell>{{ item.UpdatedBy }}</TableCell>  
      <TableCell>{{ item.UpdateSource }}</TableCell>    
    </template>
    <template #noItems>No items have been defined yet</template>    
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { UpdateHistoryEntry } from './types';
import EditedDateCell from '../editedDateCell/EditedDateCell.vue';

defineProps<{ items: UpdateHistoryEntry[] }>();

</script>
