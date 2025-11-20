<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="accommodationRoom">
    <template #table="{ items }">
      <EditAccommodationRoomTable :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditAccommodationRoomTable from './AccommodationRoomTable.vue';
import { AccommodationRoomEntry } from './types';

defineProps<{ accommodationRoom?: AccommodationRoomEntry[] | null }>();
</script>
