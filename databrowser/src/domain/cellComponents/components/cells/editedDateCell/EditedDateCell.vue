<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="date != null">
    <span class="block">{{ formattedDistance }}</span>
    <span class="block text-gray-600">{{ formattedDate }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { format as formatFn, formatDistanceToNow } from 'date-fns';

const props = withDefaults(
    defineProps<{
      date?: string;
      format?: string;
    }>(),
    {
      date: undefined,
      format: undefined,
    }
);
const { date, format } = toRefs(props);
const formattedDate = computed(() => {
  if (format.value == null) {
    return date;
  }
  if (date.value != null) {
    return formatFn(Date.parse(date.value), format.value);
  }
  return '';
});
const formattedDistance = computed(() => {
  if (date.value != null) {
    return formatDistanceToNow(Date.parse(date.value), {
      addSuffix: true,
      includeSeconds: true,
    });
  }
  return '';
});

</script>
