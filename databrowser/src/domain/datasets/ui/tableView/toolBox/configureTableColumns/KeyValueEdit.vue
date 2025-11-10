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
            class="basis-1/2"
            inputClasses="w-full"
            placeholder="Key"
            disabled
          />

          <InputSuggest
            :model-value="value"
            :suggestions="suggestions"
            class="basis-1/2"
            deletable
            inputClasses="w-full"
            placeholder="Value"
            @update:model-value="
              emit('update:data', { key, newKey: key, value: String($event) });
              checkAutocomplete(String($event));
            "
          />
        </div>
      </li>
    </ul>
    <KeySelector
      :keys="availableComponentKeys"
      :buttonText="addKeyLabel"
      class="mt-8"
      @select-key="emit('add:key', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import InputCustom from '../../../../../../components/input/InputCustom.vue';
import InputSuggest from '../../../../../../components/input/InputSuggest.vue';
import IconDelete from '../../../../../../components/svg/IconDelete.vue';
import { useMetaDataStore } from '../../../../../metaDataConfig/tourism/metaDataStore';
import { useOpenApi } from '../../../../../openApi';
import { AutocompleteGenerator } from '../../../../../openApi/autocomplete/openapi-autocomplete-generator';
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

const path = `/${useMetaDataStore().currentMetaData?.pathSegments.join('/')}/{id}`;
console.log('Current path for autocomplete:', path);

let generator: AutocompleteGenerator | null = null;
useOpenApi()
  .loadDocument('tourism')
  .then((openApiSpec) => {
    generator = new AutocompleteGenerator(openApiSpec, path);
  });

const suggestions = ref<string[]>();

const checkAutocomplete = (input: string) => {
  if (props.type !== 'objectMapping') {
    return;
  }

  if (!generator) {
    console.error('Autocomplete generator is not initialized');
    return;
  }

  suggestions.value = generator.generateSuggestions(input, 100);
};
</script>
