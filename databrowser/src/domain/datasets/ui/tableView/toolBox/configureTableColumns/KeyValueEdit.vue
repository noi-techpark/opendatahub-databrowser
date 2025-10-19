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

          <InputCustom
            :model-value="value"
            class="basis-1/2"
            inputClasses="w-full"
            placeholder="Value"
            @update:model-value="
              emit('update:data', { key, newKey: key, value: $event })
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
import { computed } from 'vue';
import InputCustom from '../../../../../../components/input/InputCustom.vue';
import KeySelector from './KeySelector.vue';

import IconDelete from '../../../../../../components/svg/IconDelete.vue';
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
</script>
