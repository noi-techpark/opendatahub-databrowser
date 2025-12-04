<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <TableCustom v-if="hasItems" class="mb-5 overflow-y-auto">
      <colgroup>
        <template v-if="hasItems">
          <col class="w-16" />
        </template>

        <!-- Slot for colgroup -->
        <slot name="colGroup"></slot>
      </colgroup>

      <TableHeader>
        <template v-if="hasItems">
          <!-- Column for checkbox selection -->
          <TableHeaderCell>
            <div class="flex">
              <CheckboxCustom
                :model-value="allItemsSelected"
                class="mr-3"
                @update:model-value="toggleAllItemsSelected(!allItemsSelected)"
              />
              <span class="hidden md:inline">Language</span>
            </div>
          </TableHeaderCell>
        </template>

        <!-- Slot for table header -->
        <slot name="tableHeader"></slot>
      </TableHeader>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(item, index) in itemsInternal as any" :key="index">
          <template v-if="hasItems">
            <TableCell class="relative">
              <CheckboxCustom
                :model-value="item.available"
                :disabled="item.disableAvailabilityChange"
                :label="labelKey ? item[labelKey] : undefined"
                @change="toggleSingleItemSelection(index)"
              />
            </TableCell>
          </template>

          <!-- Slot for table cols -->
          <slot name="tableCols" :item="item" :index="index"></slot>
        </tr>
      </tbody>
    </TableCustom>
    <div v-if="!hasItems" class="mb-5">
      <slot name="noItems"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TableHeaderCell from '../../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../../components/table/TableCell.vue';
import CheckboxCustom from '../../../../../../components/checkbox/CheckboxCustom.vue';
import TableCustom from '../../../../../../components/table/TableCustom.vue';
import TableHeader from '../../../../../../components/table/TableHeader.vue';

import { toggleAllItemsSelected } from './utils';
import { useDialogStore } from './dialogStore';
import { FileEntryWithLanguageAvailability } from './types';

const props = defineProps<{
  items: FileEntryWithLanguageAvailability[];
  hideTabLink?: boolean;
  labelKey?: string;
}>();

const dialogStore = useDialogStore();

const itemsInternal = computed<FileEntryWithLanguageAvailability[]>(() =>
  props.items != null ? props.items : []
);

const hasItems = computed(() => itemsInternal.value.length > 0);

const allItemsSelected = computed(() =>
  itemsInternal.value.every((item) => item.available)
);

const toggleSingleItemSelection = (index: number, value?: boolean) => {
  dialogStore.setAvailableItemLanguage(
    index,
    value !== undefined ? value : !itemsInternal.value[index].available
  );
};
</script>
