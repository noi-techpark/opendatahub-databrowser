<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditObjectAsListCell
    :items="geoData"
    :key-target-property="'Type'"
    :parent-key="'geoData'"
  >
    <template #table="{ items }">
      <EditGeoDataTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditGeoDataTab :items="items" />
    </template>
  </EditObjectAsListCell>
</template>

<script setup lang="ts">
import { SelectOption } from '../../../../../components/select/types';
import EditObjectAsListCell from '../../utils/editList/EditObjectAsListCell.vue';
import EditGeoDataTab from './EditGeoDataTab.vue';
import EditGeoDataTable from './EditGeoDataTable.vue';
import { useEditGeoDataCellStore } from './editGeoDataCellStore';
import { geoDataTypes } from './geoDataTypes';
import { GeoData } from './types';

const editGeoDataCellStore = useEditGeoDataCellStore();

withDefaults(
  defineProps<{
    geoData?: GeoData | null;
  }>(),
  {
    geoData: () => ({}),
  }
);

editGeoDataCellStore.setPositionOptions(
  geoDataTypes.map<SelectOption>((item) => ({
    value: item,
    label: item,
  }))
);
</script>
