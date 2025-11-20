<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-24 md:w-32" />
      <col class="w-64 md:w-48" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Source</TableHeaderCell>
      <TableHeaderCell>Id</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <StringCell :text="item.Source" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Id" />
      </TableCell>
    </template>
    <template #noItems>No room info has been defined yet</template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new room info data'"
        @click="addItem({})"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { AccommodationRoomEntry } from './types';

defineProps<{ items: AccommodationRoomEntry[] }>();

const { addItem } = useInjectActionTriggers<AccommodationRoomEntry>();
</script>
