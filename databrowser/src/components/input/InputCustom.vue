<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="relative"
    :class="[
      hasLabelTop
        ? 'flex flex-col items-start gap-1'
        : 'flex items-center gap-3',
      disabled ? 'pointer-events-none opacity-50' : '',
    ]"
  >
    <label v-if="hasLabel" :for="id">{{ label }}</label>
    <input
      :id="id"
      ref="inputRef"
      v-model="text"
      class="rounded border border-gray-400 p-2 text-black focus:border-green-500"
      :class="[inputClasses, deletable ? 'pr-10' : '']"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="type"
    />
    <span v-if="label != null" class="ml-3 font-semibold"></span>
    <div
      v-if="type === 'search' && !text"
      class="absolute right-0 flex h-full w-12 items-center justify-center"
    >
      <IconSearch class="size-5 text-green-400" />
    </div>
    <div
      v-if="deletable"
      class="absolute right-0 flex h-full w-10 items-center justify-center"
    >
      <div
        class="cursor-pointer rounded-full border border-red-500"
        @click="onDelete()"
      >
        <IconClose class="size-5 text-red-500" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { randomId } from '../utils/random';
import IconSearch from '../svg/IconSearch.vue';
import IconClose from '../svg/IconClose.vue';

import { useEventDelete } from './utils';
import { InputType } from './types';

const id = randomId();

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue?: string | boolean | number;
  label?: string;
  placeholder?: string;
  inputClasses?: string;
  focus?: boolean;
  deletable?: boolean;
  hasLabelTop?: boolean;
  disabled?: boolean;
  type?: InputType;
}>();

const inputRef = ref();
onMounted(() => {
  if (props.focus === true) {
    setTimeout(() => inputRef.value.focus(), 500);
  }
});

const hasLabel = computed(() => props.label != null && props.label.length > 0);

const text = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const onDelete = () => {
  text.value = '';
  useEventDelete.emit(true);
};
</script>

<style scoped>
.has-error input {
  @apply border-error text-error;
}
</style>
