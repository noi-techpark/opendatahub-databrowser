<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="accommodationBooking">
    <template #table="{ items }">
      <EditAccommodationBookingTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditAccommodationBookingTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditAccommodationBookingTab from './AccommodationBookingTab.vue';
import EditAccommodationBookingTable from './AccommodationBookingTable.vue';
import { AccommodationBookingEntry } from './types';

defineProps<{ accommodationBooking?: AccommodationBookingEntry[] | null }>();
</script>
