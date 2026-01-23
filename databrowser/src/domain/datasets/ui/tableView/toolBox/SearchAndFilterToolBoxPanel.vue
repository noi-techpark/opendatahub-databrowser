<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>

  <ToolBoxSectionLabel>
      <span class="mr-4">
        <span class="text-black">{{pagination.pageCount}}</span> <span class="text-dialog">{{ t('datasets.listView.recordsOutOf') }}</span> <span class="text-black">{{ pagination.totalItems }}</span>
      </span>
    <ResetAllFilters @reset-all-filters="removeAllFilters" />
  </ToolBoxSectionLabel>

  <ToolBoxCard class="bg-white">

    <ToolBoxCardBody
      v-for="(filter, index) in tableFilters"
      :key="`${filter.propertyPath}-${index}`"
      class="flex flex-col gap-2"
    >
      <button
        class="self-end p-1 text-delete"
        @click="removeFilterByIndex(index)"
      >
        <IconDelete />
      </button>

      <div class="flex items-center gap-2">
        <SelectCustom
          :model-value="filter.propertyPath"
          :options="filterColSelectOptions"
          :show-value-as-label-fallback="true"
          :z-index="30"
          class="basis-1/2"
          @update:model-value="filter.propertyPath = String($event)"
        />
        <SelectCustom
          :model-value="filter.operator"
          :options="filterTypeSelectOptions"
          :z-index="30"
          class="basis-1/2"
          @update:model-value="
              updateFilter(index, String($event), filter.value, false)
          "
        />
      </div>
      <InputFilter
        v-if="filter.operator !== 'isnull' && filter.operator !== 'isnotnull'"
        :id="`filter-${filter.propertyPath}`"
        :model-value="filter.value?.toString()"
        @update:model-value="filter.value = $event"
        @filter="updateFilter(index, filter.operator, $event, true)"
      />
    </ToolBoxCardBody>
    <ToolBoxCardBody class="flex justify-between">
      <ButtonCustom
        class="flex items-center gap-2 px-2.5 py-1.5"
        :size="Size.xs"
        :variant="Variant.solid"
        @click="updateGlobalFilter(tableFilters, true)"
      >
        <IconFilter />
        {{ t('components.inputFilter.labelButton') }}
      </ButtonCustom>
      <ButtonCustom
        class="flex items-center gap-2 p-2 py-1 font-semibold"
        :size="Size.xs"
        :variant="Variant.soft"
        @click="addEmptyFilter"
      >
        <IconAdd class="size-3" />
        {{
          t(
            'datasets.listView.toolBox.searchAndFilter.otherFilters.addNewFilter'
          )
        }}
      </ButtonCustom>
    </ToolBoxCardBody>
  </ToolBoxCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '@/components/button/types';
import InputFilter from '../../../../../components/input/InputFilter.vue';
import SelectCustom from '../../../../../components/select/SelectCustom.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import { useDatasetBaseInfoStore } from '../../../config/store/datasetBaseInfoStore';
import ToolBoxCard from '../../toolBox/ToolBoxCard.vue';
import ToolBoxCardBody from '../../toolBox/ToolBoxCardBody.vue';
import ResetAllFilters from '../filter/ResetAllFilters.vue';
import {
  mobilityFilterTypeSelectOptions,
  tourismFilterTypeSelectOptions,
} from '../filter/filterSelectOptions';
import { useTableFilterStore } from '../filter/tableFilterStore';
import { Filter, FilterOperator, FilterValue } from '../filter/types';
import IconAdd from '../../../../../components/svg/IconAdd.vue';
import IconFilter from '../../../../../components/svg/IconFilter.vue';
import {Pagination} from "@/domain/datasets/pagination/types";
import ToolBoxSectionLabel from "@/domain/datasets/ui/toolBox/ToolBoxSectionLabel.vue";

const { t } = useI18n();

defineProps<{
  pagination: Pagination
}>();


const { datasetDomain } = storeToRefs(useDatasetBaseInfoStore());
const filterTypeSelectOptions = computed(() => {
  if (datasetDomain.value === 'tourism') {
    return tourismFilterTypeSelectOptions;
  }
  if (datasetDomain.value === 'mobility') {
    return mobilityFilterTypeSelectOptions;
  }
  return [];
});

const { tableFilters, filterColSelectOptions } = storeToRefs(
  useTableFilterStore()
);
const {
  addEmptyFilter,
  removeAllFilters,
  removeFilterByIndex,
  updateFilterValueByIndex,
  updateFilterValueByAllSelectedTable,
} = useTableFilterStore();

const updateFilter = (
  index: number,
  operator: FilterOperator,
  value: FilterValue,
  unconditionallyApplyFilters: boolean
) => {
  // Apply filters if operator is 'isnull' or 'isnotnull' or if the user
  // explicitly wants to apply the filters
  const applyFilters =
    unconditionallyApplyFilters ||
    operator === 'isnull' ||
    operator === 'isnotnull';
  updateFilterValueByIndex(index, operator, value, applyFilters);
};

const updateGlobalFilter = (
  tableFilters: Filter[],
  unconditionallyApplyFilters: boolean
) => {
  // Check if any filter operator is 'isnull' or 'isnotnull'
  const applyFilters =
    tableFilters.some((filter) =>
      ['isnull', 'isnotnull'].includes(filter.operator)
    ) || unconditionallyApplyFilters;

  updateFilterValueByAllSelectedTable(tableFilters, applyFilters);
};
</script>
