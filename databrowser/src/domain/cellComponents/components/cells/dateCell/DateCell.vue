<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <InputCustom
    v-if="isWriteable"
    input-classes="w-full"
    :model-value="parsedDate"
    :type="inputType"
    @update:model-value="update($event)"
  />
  <span v-else>{{ formattedDate }}</span>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { format as formatFn } from 'date-fns';
import { useWriteable } from '../../utils/writeable/useWriteable';
import InputCustom from '../../../../../components/input/InputCustom.vue';

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{
    date?: string;
    format?: string;
    type?: 'date' | 'datetime' | 'time';
    editable?: boolean;
    readonly?: string | boolean;
  }>(),
  {
    date: undefined,
    format: undefined,
    type: 'date',
    editable: true,
    readonly: false,
  }
);

const { editable, readonly } = toRefs(props);

const formattedDate = computed(() => {
  if (props.format == null) {
    return props.date;
  }
  if (props.date == null) {
    return '';
  }
  return formatFn(Date.parse(props.date), props.format);
});

const inputType = computed(() =>
  props.type === 'datetime'
    ? 'datetime-local'
    : props.type === 'date'
      ? 'date'
      : 'time'
);

const parsedDate = computed(() => {
  if (props.date == null) {
    return props.date;
  }

  const parsedDate = Date.parse(props.date);

  if (isNaN(parsedDate)) {
    return props.date;
  }

  const pattern =
    inputType.value === 'date' ? 'yyyy-MM-dd' : "yyyy-MM-dd'T'HH:mm";

  return formatFn(parsedDate, pattern);
});

const isWriteable = useWriteable({ editable, readonly });

const update = (value: unknown) =>
  emit('update', {
    prop: 'date',
    value,
  });
</script>
