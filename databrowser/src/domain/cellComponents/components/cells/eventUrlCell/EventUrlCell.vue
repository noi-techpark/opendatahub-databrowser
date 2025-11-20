<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="eventUrls">
    <template #table="{ items }">
      <EditEventUrlTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditEventUrlTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditEventUrlTab from './EventUrlTab.vue';
import EditEventUrlTable from './EventUrlTable.vue';
import { EventUrlEntry } from './types';

defineProps<{ eventUrls?: EventUrlEntry[] | null }>();
</script>
