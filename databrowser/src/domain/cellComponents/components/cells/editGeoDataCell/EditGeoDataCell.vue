<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditObjectAsListCell :items="geoData" :key-target-property="'Type'" :parent-key="'geoData'">
    <template #table="{ items }">
      <EditGeoDataTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditGeoDataTab :items="items" />
    </template>
  </EditObjectAsListCell>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue';
import { SelectOption } from '../../../../../components/select/types';
import { useApiRead } from '../../../../api/useApi';
import EditObjectAsListCell from '../../utils/editList/EditObjectAsListCell.vue';
import EditGeoDataTab from './EditGeoDataTab.vue';
import EditGeoDataTable from './EditGeoDataTable.vue';
import { useEditGeoDataCellStore } from './editGeoDataCellStore';
import { GeoData } from './types';

const editGeoDataCellStore = useEditGeoDataCellStore();

const props = withDefaults(
  defineProps<{
    geoData?: GeoData | null;
    positionValuesUrl: string;
  }>(),
  {
    geoData: () => ({}),
  }
);

const { positionValuesUrl } = toRefs(props);

const { data: positionValues } = useApiRead<string[]>(positionValuesUrl);

watch(
  () => positionValues.value,
  (newVal) => {
    setPositionValuesInStore(newVal);
  }
);

const setPositionValuesInStore = (data?: string[]) => {
  if (!data) {
    editGeoDataCellStore.setPositionOptions([]);
    return;
  }

  editGeoDataCellStore.setPositionOptions(
    data.map<SelectOption>((item) => ({
      value: item,
      label: item,
    }))
  );
};
</script>
