<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ListboxOptions
    role="group"
    class="bg-white text-base focus-visible:outline-hidden"
    as="div"
  >
    <template v-if="slots.header != null">
      <slot name="header"></slot>
    </template>

    <ul class="max-h-80 overflow-y-auto">
      <template v-if="searchResults != null">
        <SelectOptionsListItem
          v-for="option in searchResults"
          :key="option.value"
          :value="option.value"
          :label="option.label"
          :isAction="option.isAction"
        />
      </template>

      <template v-if="searchResultsGroupedOptions != null">
        <template
          v-for="(groupOption, index) in searchResultsGroupedOptions"
          :key="index + groupOption.name"
        >
          <ListboxOption
            class="mx-2 border-b border-gray-250 px-2 py-2 text-dialog"
            :disabled="true"
          >
            <span class="block">
              {{ groupOption.name }}
            </span>
          </ListboxOption>

          <SelectOptionsListItem
            v-for="option in groupOption.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :isAction="option.isAction"
          />
        </template>
      </template>
    </ul>
  </ListboxOptions>
</template>

<script setup lang="ts">
import SelectOptionsListItem from './SelectOptionsListItem.vue';
import { GroupSelectOption, SelectOption } from './types';
import { ListboxOptions, ListboxOption } from '@headlessui/vue';

defineProps<{
  searchResults?: SelectOption[];
  searchResultsGroupedOptions?: GroupSelectOption[];
}>();
const slots = defineSlots<{ header: unknown }>();
</script>
