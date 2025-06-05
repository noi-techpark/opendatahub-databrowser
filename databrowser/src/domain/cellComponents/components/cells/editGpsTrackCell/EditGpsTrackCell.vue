<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="gpsTrack">
    <template #table="{ items }">
      <EditGpsTrackTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditGpsTrackTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditGpsTrackTab from './EditGpsTrackTab.vue';
import EditGpsTrackTable from './EditGpsTrackTable.vue';
import { GpsTrackEntry } from './types';

defineProps<{ gpsTrack?: GpsTrackEntry[] | null }>();
</script>
