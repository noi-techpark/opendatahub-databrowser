<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>      
      <col class="w-52 md:w-52" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />      
    </template>

    <template #tableHeader>
      <TableHeaderCell>Publisher ID</TableHeaderCell>
      <TableHeaderCell>Ranc</TableHeaderCell>
      <TableHeaderCell>PublicationStatus</TableHeaderCell>      
    </template>

    <template #tableCols="{ item }">
      <TableCell>{{ item.PublisherRID }} </TableCell>      
      <TableCell>{{ item.Ranc }} </TableCell>
      <TableCell>{{ item.PublicationStatus }} </TableCell>      
    </template>
    <template #noItems>No eventpublisher have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new eventpublisher data'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { EventPublisherEntry } from './types';

defineProps<{ items: EventPublisherEntry[] }>();

const { addItem } = useInjectActionTriggers<EventPublisherEntry>();
</script>
