<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="items">
    <template #table="{ items }">
      <ArrayEditableTable :items="items" :options="options" />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import EditListCell from '../../utils/editList/EditListCell.vue';
import ArrayEditableTable from './ArrayEditableTable.vue';
import { useAttributeMapper } from './useAttributeMapper';

withDefaults(
  defineProps<{
    items?: string[] | null;
  }>(),
  {
    items: () => [],
    options: () => [],
  }
);

const attrs = useAttrs();

const { options } = useAttributeMapper(attrs, true);
</script>
