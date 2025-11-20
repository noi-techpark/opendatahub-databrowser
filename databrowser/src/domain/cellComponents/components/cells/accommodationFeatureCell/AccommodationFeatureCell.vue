<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="accommodationFeature">
    <template #table="{ items }">
      <EditAccommodationFeatureTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditAccommodationFeatureTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditAccommodationFeatureTab from './AccommodationFeatureTab.vue';
import EditAccommodationFeatureTable from './AccommodationFeatureTable.vue';
import { AccommodationFeatureEntry } from './types';

defineProps<{ accommodationFeature?: AccommodationFeatureEntry[] | null }>();
</script>
