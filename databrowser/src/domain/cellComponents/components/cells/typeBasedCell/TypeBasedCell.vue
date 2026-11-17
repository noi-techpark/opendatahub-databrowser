<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="data != null" class="max-h-32 overflow-auto">
    <span v-if="dataInfo.type == 'string' || dataInfo.type == 'number'">{{
      dataInfo.data
    }}</span>
    <span
      v-else-if="dataInfo.type == 'boolean'"
      :class="{ 'text-green-400': data, 'text-red-400': !data }"
      >{{ dataInfo.data }}</span
    >
    <span v-else-if="dataInfo.type == 'date'">{{ dataInfo.data }}</span>
    <pre v-else>{{ dataInfo.data }}</pre>
  </div>
</template>

<script setup lang="ts">
import { format, isValid, parseISO } from 'date-fns';
import { computed } from 'vue';
import { DEFAULT_DATE_TIME_FORMAT } from '../../../../../config/utils';

const props = withDefaults(
  defineProps<{
    data?: unknown;
  }>(),
  {
    data: undefined,
  }
);

const dataInfo = computed<{ type: string; data: unknown }>(() => {
  if (typeof props.data === 'string' || props.data instanceof String) {
    const parsedDate = parseDateString(props.data as string);

    return parsedDate != null
      ? { type: 'date', data: format(parsedDate, DEFAULT_DATE_TIME_FORMAT) }
      : { type: 'string', data: props.data };
  }
  if (typeof props.data === 'number') {
    return { type: 'number', data: props.data };
  }
  if (typeof props.data === 'boolean') {
    return { type: 'boolean', data: props.data };
  }
  if (Array.isArray(props.data)) {
    return { type: 'array', data: props.data };
  }
  return { type: 'object', data: JSON.stringify(props.data, null, 2) };
});

// Require at least a full calendar date (YYYY-MM-DD). parseISO alone also
// accepts e.g. "2131" or "24" as years, which turns numeric station codes
// into dates.
const isoDatePrefix = /^\d{4}-\d{2}-\d{2}(?:$|[T ])/;

const parseDateString = (value: string): Date | undefined => {
  if (!isoDatePrefix.test(value)) {
    return undefined;
  }
  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? parsedDate : undefined;
};
</script>
