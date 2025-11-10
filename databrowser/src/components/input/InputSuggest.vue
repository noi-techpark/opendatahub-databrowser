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
    <Combobox
      v-model="selected"
      @update:model-value="text = $event"
      v-slot="{ open }"
    >
      <div class="relative">
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
          @change="text = $event.target.value"
          @keydown.enter="handleSuggestionSelect"
          @keydown.tab="handleSuggestionSelect"
          @keydown.escape="selected = String(text)"
        />

        <ComboboxOptions
          class="absolute z-[10] max-h-80 w-full overflow-y-auto rounded-b border border-gray-300 bg-white text-base ring-gray-400 focus-visible:outline-none"
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

    <div
      v-if="deletable"
      class="absolute right-0 flex h-full w-10 items-center justify-center"
    >
      <button
        class="rounded p-1 text-green-500"
        :class="{ hidden: String(text).length === 0 }"
        @click="onDelete"
      >
        <IconClose class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { randomId } from '../utils/random';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue';
import { useI18n } from 'vue-i18n';
import IconClose from '../svg/IconClose.vue';
import { InputType } from './types';

const { t } = useI18n();

const id = randomId();

const text = defineModel<string | boolean | number>();

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    focus: false,
    deletable: false,
    hasLabelTop: false,
    disabled: false,
    suggestions: () => [],
  }
);

const hasLabel = computed(() => props.label != null && props.label.length > 0);

const onDelete = () => {
  selected.value = '';
  text.value = '';
};

const selected = ref(text.value);

const handleSuggestionSelect = () => {
  if (props.suggestions.some((s) => s === selected.value)) {
    text.value = String(selected.value);
  } else if (!props.suggestions.some((s) => s === text.value)) {
    selected.value = String(text.value);
  }
};
</script>
