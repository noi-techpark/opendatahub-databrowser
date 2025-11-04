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
      v-if="suggestions == null"
      :id="id"
      ref="inputRef"
      v-model="text"
      class="rounded border border-gray-400 p-2 text-black focus:border-green-500 focus:ring-transparent"
      :class="[inputClasses, deletable ? 'pr-10' : '']"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="type"
      :min="min"
      :max="max"
    />
    <Combobox
      v-else
      v-model="selected"
      @update:model-value="text = $event"
      v-slot="{ open }"
    >
      <div class="relative mt-1">
        <ComboboxInput
          :id="id"
          ref="inputRef"
          class="border border-gray-400 p-2 text-black focus:border-green-500 focus:ring-transparent"
          :class="[
            inputClasses,
            deletable ? 'pr-10' : '',
            open ? 'rounded-t' : 'rounded',
          ]"
          :placeholder="placeholder"
          :disabled="disabled"
          :type="type"
          :min="min"
          :max="max"
          :displayValue="(s) => String(s)"
          @change="text = $event.target.value"
          @keydown.enter="handleSuggestionSelect($event, open)"
          @keydown.tab="handleSuggestionSelect($event, open)"
        />

        <ComboboxOptions
          class="absolute z-[1] max-h-80 w-full overflow-y-auto rounded-b border border-gray-300 bg-white text-base ring-gray-400 focus-visible:outline-none"
        >
          <div
            v-if="suggestions.length === 0 && text !== ''"
            class="relative cursor-default select-none py-1 pl-4 pr-8 text-gray-700"
          >
            {{ t('components.inputSuggest.notFound') }}
          </div>

          <ComboboxOption
            v-for="s in suggestions"
            as="template"
            :key="s"
            :value="s"
            v-slot="{ selected, active }"
          >
            <li
              :class="[
                { 'bg-green-500/10': active || selected },
                { 'text-green-500': selected },
                'cursor-pointer select-none break-words px-4 py-1',
              ]"
            >
              <span :class="[{ 'font-semibold': selected }]">
                {{ s }}
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>

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
import IconClose from '../svg/IconClose.vue';
import IconSearch from '../svg/IconSearch.vue';
import { randomId } from '../utils/random';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue';
import { useI18n } from 'vue-i18n';
import { InputType } from './types';
import { useEventDelete } from './utils';

const { t } = useI18n();

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
  min?: number;
  max?: number;
  suggestions?: string[];
  zIndex?: number;
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

const selected = ref(
  props.suggestions != null && props.modelValue != null
    ? String(props.modelValue)
    : null
);

const handleSuggestionSelect = (event: KeyboardEvent, open: boolean) => {
  if (text.value == '') {
    text.value = '';
    selected.value = '';
    return;
  }
  if (props.suggestions?.some((s) => s === selected.value)) {
    text.value = String(selected.value);
  } else if (!props.suggestions?.some((s) => s === text.value)) {
    selected.value = String(text.value);
  }
  if (open) {
    event.preventDefault();
  }
};
</script>

<style scoped>
.has-error input {
  @apply border-error text-error;
}
</style>
