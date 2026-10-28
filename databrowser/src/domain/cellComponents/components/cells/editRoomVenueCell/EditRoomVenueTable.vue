<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-52 md:w-52" />
      <col class="w-40 md:w-52" />
      <col class="w-32 md:w-32" />
      <col class="w-32 md:w-32" />
      <col class="w-32 md:w-32" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Shortname</TableHeaderCell>
      <TableHeaderCell>Room Title</TableHeaderCell>
      <TableHeaderCell>Active</TableHeaderCell>
      <TableHeaderCell>SquareMeters</TableHeaderCell>
      <TableHeaderCell>Capacity</TableHeaderCell>
      <TableHeaderCell>Placement</TableHeaderCell>
      <TableHeaderCell>TagIds</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>{{ item.Shortname }} </TableCell>
      <TableCell>{{ item.Detail?.[language]?.Title }} </TableCell>
      <TableCell>
        <ToggleTriStateCell
          :enabled="booleanOrStringToBoolean(item.Active)"
          :editable="false"
        />
      </TableCell>
      <TableCell>{{ item.VenueRoomProperties?.SquareMeters }} </TableCell>
      <TableCell>{{ item.MaxCapacity }} </TableCell>
      <TableCell>{{ item.Placement }} </TableCell>
      <TableCell>
        <div v-for="tag in item.TagIds" :key="tag">
          {{ tag }}
        </div>
      </TableCell>
    </template>
    <template #noItems>No rooms have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new room'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import { useDatasetQueryStore } from '../../../../datasets/location/store/datasetQueryStore';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import ToggleTriStateCell from '../toggleCell/ToggleTriStateCell.vue';
import { RoomVenueEntry } from './types';

defineProps<{ items: RoomVenueEntry[] }>();

const { addItem } = useInjectActionTriggers<RoomVenueEntry>();

const language = computed(
  () => useDatasetQueryStore().handle('language').value ?? 'en'
);
</script>
