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
      <col class="w-24 md:w-24" />
      <col class="w-40 md:w-44" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>
    <template #tableHeader>
      <TableHeaderCell>MAP</TableHeaderCell>
      <TableHeaderCell>GEO-TYPE</TableHeaderCell>
      <TableHeaderCell>WKT4236</TableHeaderCell>
      <TableHeaderCell>DEFAULT</TableHeaderCell>
      <TableHeaderCell>LATITUDE</TableHeaderCell>
      <TableHeaderCell>LONGITUDE</TableHeaderCell>
      <TableHeaderCell>ALTITUDE</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <GeoDataMap
          v-if="item.Geometry"
          class="h-24"
          ref="geoDataMap"
          :prevent-interaction="true"
          :fullscreen-on-click="true"
          :wkt="item.Geometry"
        />

        <div v-else>Missing coordinates</div>
      </TableCell>
      <TableCell>{{ item.Type }}</TableCell>
      <TableCell>{{ item.Geometry }}</TableCell>
      <TableCell><ToggleButtonCell :enabled="item.Default" :readonly="false" :text="(item.Default || false).toString()"/></TableCell>
      <TableCell>{{ item.Latitude }}</TableCell>
      <TableCell>{{ item.Longitude }}</TableCell>
      <TableCell>{{ item.Altitude }}</TableCell>
    </template>
    <template #noItems>No Geo Data has been added yet.</template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new Geo Data'"
        @click="addNewGeoData()"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import GeoDataMap from './GeoDataMap.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { GeoDataEntry } from './types';
import ToggleButtonCell from '../toggleCell/ToggleButtonCell.vue';

const props = defineProps<{ items: GeoDataEntry[] }>();

const { navigateToTab } = useInjectNavigation();

const { addItems } = useInjectActionTriggers<GeoDataEntry>();

const addNewGeoData = () => {
  addItems([{Type: "", Default: false}]);
  navigateToTab(props.items.length);
};

const geoDataMap = ref();
</script>
