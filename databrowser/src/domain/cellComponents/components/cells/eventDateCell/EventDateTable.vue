<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-28 md:w-32" />
      <col class="w-28 md:w-32" />
      <col class="w-28 md:w-32" />
      <col class="w-28 md:w-32" />
      <col class="w-28 md:w-32" />
      <col class="w-48 md:w-48" />
      <col class="w-48 md:w-48" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>From</TableHeaderCell>
      <TableHeaderCell>Begin</TableHeaderCell>
      <TableHeaderCell>To</TableHeaderCell>
      <TableHeaderCell>End</TableHeaderCell>
      <TableHeaderCell>Price From</TableHeaderCell>
      <TableHeaderCell>Bookable</TableHeaderCell>
      <TableHeaderCell>Active</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <DateCell
          :editable="false"
          :date="item.From"
          :format="DEFAULT_DATE_FORMAT"
        />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Begin" />
      </TableCell>
      <TableCell>
        <DateCell
          :editable="false"
          :date="item.To"
          :format="DEFAULT_DATE_FORMAT"
        />
      </TableCell>
      <TableCell>
        <StringCell :text="item.End" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.PriceFrom" />
      </TableCell>
      <TableCell>
        <ToggleTriStateCell
          :enabled="booleanOrStringToBoolean(item.IsBookable)"
          :editable="false"
        />
      </TableCell>
      <TableCell>
        <ToggleTriStateCell
          :enabled="booleanOrStringToBoolean(item.Active)"
          :editable="false"
        />
      </TableCell>
    </template>
    <template #noItems>No date has been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new Date'" @click="addItem({})" />
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
import { EventDateEntry } from './types';
import DateCell from '../dateCell/DateCell.vue';
import { DEFAULT_DATE_FORMAT } from '../../../../../config/utils';

defineProps<{ items: EventDateEntry[] }>();

const { addItem } = useInjectActionTriggers<EventDateEntry>();
</script>
