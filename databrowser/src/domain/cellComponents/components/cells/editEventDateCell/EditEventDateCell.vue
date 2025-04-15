<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="eventDates">
    <template #table="{ items }">
      <EditEventDateTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditEventDateTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditEventDateTab from './EditEventDateTab.vue';
import EditEventDateTable from './EditEventDateTable.vue';
import { EventDateEntry } from './types';

defineProps<{ eventDates?: EventDateEntry[] | null }>();
</script>
