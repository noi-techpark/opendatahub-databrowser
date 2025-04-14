<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="eventPublisher">
    <template #table="{ items }">
      <EditEventPublisherTable :items="items" />
    </template>
    <template #tab="{ items }">
      <EditEventPublisherTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import EditEventPublisherTab from './EditEventPublisherTab.vue';
import EditEventPublisherTable from './EditEventPublisherTable.vue';
import { EventPublisherEntry } from './types';

defineProps<{ eventPublisher?: EventPublisherEntry[] | null }>();
</script>
