<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="tags">
    <template #table="{ items }">
      <TagTable
        :tags="items"
        :options="options"
        :unique="enableUniqueValue"
        v-bind="attrs"
      />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { computed, toRefs, useAttrs } from 'vue';
import EditListCell from '../../utils/editList/EditListCell.vue';
import TagTable from './TagTable.vue';
import { useAttributeMapper } from './useAttributeMapper';

const props = withDefaults(
  defineProps<{
    tags?: string[] | null;
    sortByLabel?: boolean;
    unique?: boolean | string;
  }>(),
  {
    tags: () => [],
    sortByLabel: true,
    unique: false,
  }
);

const { tags, sortByLabel, unique } = toRefs(props);

const attrs = useAttrs();

const { options } = useAttributeMapper(attrs, sortByLabel);

const enableUniqueValue = computed(() => {
  // if unique is a boolean, return it
  if (typeof unique.value === 'boolean') {
    return unique.value;
  }
  // if unique is a string, return the boolean value of the string
  if (typeof unique.value === 'string') {
    return unique.value === 'true';
  }
  return false;
});
</script>
