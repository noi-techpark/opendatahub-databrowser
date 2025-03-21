<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-44 md:w-48" />
      <col class="w-40 md:w-44" />
      <col class="w-40 md:w-44" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>
    <template #tableHeader>
      <TableHeaderCell>MAP</TableHeaderCell>
      <TableHeaderCell>GPS-TYPE</TableHeaderCell>
      <TableHeaderCell>LATITUDE</TableHeaderCell>
      <TableHeaderCell>LONGITUDE</TableHeaderCell>
      <TableHeaderCell>ALTITUDE</TableHeaderCell>
      <TableHeaderCell>UNIT</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <GpsPointMap
          v-if="item.latitude && item.longitude"
          class="h-24"
          ref="gpsPointMap"
          :prevent-interaction="true"
          :fullscreen-on-click="true"
          :latitude="item.latitude"
          :longitude="item.longitude"
        />

        <div v-else>Missing coordinates</div>
      </TableCell>
      <TableCell>{{ item.gpsType }}</TableCell>
      <TableCell>{{ item.latitude }}</TableCell>
      <TableCell>{{ item.longitude }}</TableCell>
      <TableCell>{{ item.altitude }}</TableCell>
      <TableCell>{{ item.unitMeasureAltitude }}</TableCell>
    </template>
    <template #noItems>No GPS Point has been added yet.</template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new GPS Point'"
        @click="addNewGpsPoint()"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import GpsPointMap from './GpsPointMap.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { GpsInfoEntry } from './types';

const props = defineProps<{ items: GpsInfoEntry[] }>();

const { navigateToTab } = useInjectNavigation();

const { addItems } = useInjectActionTriggers<GpsInfoEntry>();

const addNewGpsPoint = () => {
  addItems([{ unitMeasureAltitude: 'm' }]);
  navigateToTab(props.items.length);
};

const gpsPointMap = ref();
</script>
