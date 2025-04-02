<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="updatehistoryitems">
    <template #table="{ items }">
      <UpdateHistoryTable :items="items" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import EditListCell from '../../utils/editList/EditListCell.vue';
import UpdateHistoryTable from './UpdateHistoryTable.vue';
import { UpdateHistoryEntry } from './types';

defineProps<{ updatehistoryitems?: UpdateHistoryEntry[] | null }>();
</script>
