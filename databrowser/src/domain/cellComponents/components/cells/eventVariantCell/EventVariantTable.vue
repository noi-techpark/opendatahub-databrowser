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
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Price</TableHeaderCell>
      <TableHeaderCell>isStandard</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <StringCell :text="item.Name" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Price" />
      </TableCell>
      <TableCell>
        <ToggleTriStateCell
          :enabled="booleanOrStringToBoolean(item.IsStandard)"
          :editable="false"
        />
      </TableCell>
    </template>
    <template #noItems>No variant has been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new variant data'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { EventVariantEntry } from './types';

defineProps<{ items: EventVariantEntry[] }>();

const { addItem } = useInjectActionTriggers<EventVariantEntry>();
</script>
