<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="eventVariant">
    <template #table="{ items }">
      <EditEventVariantTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditEvenVariantTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditEvenVariantTab from './EditEventVariantTab.vue';
import EditEventVariantTable from './EditEventVariantTable.vue';
import { EventVariantEntry } from './types';

defineProps<{ eventVariant?: EventVariantEntry[] | null }>();
</script>
