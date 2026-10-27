<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <InputCustom
    v-if="isWriteable"
    input-classes="w-full"
    :model-value="text"
    :deletable="deletable"
    :placeholder="placeholder"
    :type="type"
    @update:model-value="update($event)"
  />
  <span
    v-else
    :class="[
      clickable ? 'cursor-pointer text-hint-info underline' : '',
      textClasses,
    ]"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import InputCustom from '../../../../../components/input/InputCustom.vue';
import { useWriteable } from '../../utils/writeable/useWriteable';
import { InputType } from '../../../../../components/input/types';

const emit = defineEmits(['update']);

const props = defineProps<{
  text?: string | boolean | number;
  editable?: boolean;
  clickable?: boolean;
  deletable?: boolean;
  readonly?: string | boolean;
  placeholder?: string;
  textClasses?: string;
  type?: InputType;
}>();

const { editable, readonly } = toRefs(props);
const isWriteable = useWriteable({ editable, readonly });

const update = (value: unknown) =>
  emit('update', {
    prop: 'text',
    value,
  });
</script>

<style scoped>
@reference '@/index.css';

.has-error input {
  @apply border-error text-error;
}
</style>
