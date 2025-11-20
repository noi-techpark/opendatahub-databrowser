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
      <TableHeaderCell>Type</TableHeaderCell>
      <TableHeaderCell>Url</TableHeaderCell>
      <TableHeaderCell>Active</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <StringCell :text="item.Type" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Url" />
      </TableCell>
      <TableCell>
        <ToggleTriStateCell
          :enabled="booleanOrStringToBoolean(item.Active)"
          :editable="false"
        />
      </TableCell>
    </template>
    <template #noItems>No url has been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new url data'" @click="addItem({})" />
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
import { EventUrlEntry } from './types';

defineProps<{ items: EventUrlEntry[] }>();

const { addItem } = useInjectActionTriggers<EventUrlEntry>();
</script>
