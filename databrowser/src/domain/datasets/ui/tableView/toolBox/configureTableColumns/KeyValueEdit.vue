<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <ul class="flex flex-col gap-4 divide-y divide-gray-250">
      <li
        v-for="(value, key) in data"
        :key="key"
        class="flex flex-col gap-2 pt-3"
      >
        <button
          class="self-end rounded p-1 text-delete"
          @click="emit('delete:key', key)"
        >
          <IconDelete />
        </button>

        <div class="flex gap-3">
          <InputCustom
            :model-value="key"
            :disabled="type === 'objectMapping'"
            class="basis-1/2"
            inputClasses="w-full"
            placeholder="Key"
            @update:modelValue="
              emit('update:data', {
                key,
                newKey: String($event),
                value,
              })
            "
          />

          <InputSuggest
            v-if="suggestions != null"
            :model-value="value"
            :suggestions="suggestions"
            class="basis-1/2"
            deletable
            inputClasses="w-full"
            placeholder="Value"
            @update:model-value="
              emit('update:data', { key, newKey: key, value: String($event) });
              updateSuggestionTerm(String($event));
            "
          />
          <InputCustom
            v-else
            :model-value="value"
            class="basis-1/2"
            deletable
            inputClasses="w-full"
            placeholder="Value"
            @update:model-value="
              emit('update:data', { key, newKey: key, value: String($event) })
            "
          />
        </div>
      </li>
    </ul>
    <KeySelector
      v-if="type === 'objectMapping'"
      :keys="availableComponentKeys"
      :buttonText="addKeyLabel"
      class="mt-8"
      @select-key="
        emit('add:key', $event);
        updateSuggestionTerm('');
      "
    />
    <ButtonCustom
      v-else
      class="mt-8"
      :size="Size.sm"
      @click="emit('add:key', '')"
    >
      {{ addKeyLabel }}
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../../components/button/types';
import InputCustom from '../../../../../../components/input/InputCustom.vue';
import InputSuggest from '../../../../../../components/input/InputSuggest.vue';
import IconDelete from '../../../../../../components/svg/IconDelete.vue';
import { useOpenApiPathSuggestion } from '../../../../../openApi/autocomplete/useOpenApiPathSuggestion';
import KeySelector from './KeySelector.vue';

export interface KeyValueEditData {
  key: string;
  newKey: string | Event;
  value: string | Event;
}

const emit = defineEmits<{
  (e: 'update:data', data: KeyValueEditData): void;
  (e: 'add:key', key: string): void;
  (e: 'delete:key', key: string): void;
}>();

const props = withDefaults(
  defineProps<{
    availableKeys: string[];
    type: 'objectMapping' | 'params';
    data?: Record<string, string>;
    addKeyLabel?: string;
  }>(),
  {
    data: () => ({}) as Record<string, string>,
    addKeyLabel: '+ Add entry',
  }
);

const availableComponentKeys = computed<string[]>(() => {
  return props.availableKeys.filter((key) => props.data?.[key] == null);
});

const { suggestions, updateSuggestionTerm } = useOpenApiPathSuggestion();
</script>
