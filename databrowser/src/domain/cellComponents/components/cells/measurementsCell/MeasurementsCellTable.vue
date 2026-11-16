<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-28 md:w-28" />
      <col class="w-28 md:w-28" />
      <col class="w-28 md:w-28" />
      <col class="w-32 md:w-40" />
      <col class="w-28 md:w-28" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>tdescription</TableHeaderCell>
      <TableHeaderCell>tname</TableHeaderCell>
      <TableHeaderCell>ttype</TableHeaderCell>
      <TableHeaderCell>tunit</TableHeaderCell>
      <TableHeaderCell>mvalue</TableHeaderCell>
      <TableHeaderCell>mvalidtime</TableHeaderCell>
      <TableHeaderCell>mperiod</TableHeaderCell>
      <TableHeaderCell>tmetadata</TableHeaderCell>
    </template>

    <template #tableCols="{ item }: { item: DataEntry }">
      <TableCell>{{ item.tdescription }}</TableCell>
      <TableCell>{{ item.tname }}</TableCell>
      <TableCell>{{ item.ttype }}</TableCell>
      <TableCell>{{ item.tunit }}</TableCell>
      <TableCell>{{ item.mvalue }}</TableCell>
      <TableCell>
        <EditedDateCell
          :date="item.mvalidtime"
          :format="DEFAULT_DATE_TIME_FORMAT"
        />
      </TableCell>
      <TableCell>{{ item.mperiod }}</TableCell>
      <TableCell>{{ item.tmetadata }}</TableCell>
    </template>
    <template #noItems>No measurements available</template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import { DEFAULT_DATE_TIME_FORMAT } from '../../../../../config/utils';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditedDateCell from '../editedDateCell/EditedDateCell.vue';
import { DataEntry } from './types';

defineProps<{ items: DataEntry[] }>();
</script>
