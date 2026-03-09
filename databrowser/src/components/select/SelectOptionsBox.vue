<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="border border-gray-300 ring-gray-400 w-fit md:w-auto">
    <SelectOptionsList
      :search-results="searchResults"
      :search-results-grouped-options="searchResultsGroupedOptions"
    >
      <template v-if="showSearch" #header>
        <div class="bg-gray-100 p-3">
          <InputCustom
            v-model="modelValue"
            :focus="true"
            input-classes="w-full"
            placeholder="Search data"
          />
        </div>
      </template>
    </SelectOptionsList>
  </div>
</template>

<script setup lang="ts">
import InputCustom from '../input/InputCustom.vue';
import SelectOptionsList from './SelectOptionsList.vue';
import { GroupSelectOption, SelectOption } from './types';

const props = defineProps<{
  showSearch: boolean;
  searchResults?: SelectOption[];
  searchResultsGroupedOptions?: GroupSelectOption[];
}>();

const modelValue = defineModel<string>({ required: true });

// Ensure that either searchResults or searchResultsGroupedOptions is defined, but not both
if (
  (props.searchResults && props.searchResultsGroupedOptions) ||
  (!props.searchResults && !props.searchResultsGroupedOptions)
) {
  throw new Error(
    "You must provide either 'searchResults' or 'searchResultsGroupedOptions', but not both."
  );
}
</script>
