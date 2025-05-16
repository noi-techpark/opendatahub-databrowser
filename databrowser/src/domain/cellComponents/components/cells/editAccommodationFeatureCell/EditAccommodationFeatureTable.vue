<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-16 md:w-24" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-16 md:w-24" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Id</TableHeaderCell>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Hgv Id</TableHeaderCell>
      <TableHeaderCell>Ota Codes</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <StringCell :text="item.Id" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Name" />
      </TableCell>
    </template>
    <template #noItems>No feature info has been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new feature info data'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { AccommodationFeatureEntry } from './types';

defineProps<{ items: AccommodationFeatureEntry[] }>();

const { addItem } = useInjectActionTriggers<AccommodationFeatureEntry>();
</script>
