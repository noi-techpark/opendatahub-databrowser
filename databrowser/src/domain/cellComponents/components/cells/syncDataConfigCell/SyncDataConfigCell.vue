<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="syncdataconfigs">
    <template #table="{ items }">
      <SyncDataConfigTable :items="items" />
    </template>
    <template #tab="{ items }">
      <SyncDataConfigTab :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import SyncDataConfigTable from './SyncDataConfigTable.vue';
import SyncDataConfigTab from './SyncDataConfigTab.vue';
import { SyncDataConfigEntry } from './types';

defineProps<{ syncdataconfigs?: SyncDataConfigEntry[] | null }>();
</script>
