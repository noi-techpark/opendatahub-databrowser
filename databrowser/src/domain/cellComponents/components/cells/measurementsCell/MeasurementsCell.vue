<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="measurements">
    <template #table="{ items }">
      <MeasurementsCellTable :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EditListCell from '../../utils/editList/EditListCell.vue';
import MeasurementsCellTable from './MeasurementsCellTable.vue';
import { DataEntry } from './types';

const props = defineProps<{ data?: DataEntry[] | null }>();

// Stations without measurements still yield one entry (the station itself),
// but without any data type. Skip such entries, so no empty row is shown.
const measurements = computed(() =>
  props.data?.filter((entry) => entry.tname != null)
);
</script>
