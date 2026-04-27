<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-60" />
      <col v-if="showUrl" class="w-32 md:w-60" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell v-if="showUrl">Url</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }">
      <TableCell>
        <SelectWithOptionsCell
          :editable="editable"
          :options="getOptionsForItem(item, itemSet)"
          :show-empty-value="false"
          :value="item"
          @update="updateItem(index, $event.value)"
        />
      </TableCell>
      <TableCell v-if="showUrl">
        <UrlCell
          :editable="false"
          :text="options.find((option) => option.value === item)?.url"
        />
      </TableCell>
    </template>
    <template #noItems>No items have been defined yet</template>
    <template #addItems>
      <EditListAddButton
        :text="addLabel"
        @click="addItems([options[0].value])"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { SelectOption } from '../../../../../components/select/types';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import UrlCell from '../UrlCell/UrlCell.vue';

const props = withDefaults(
  defineProps<{
    items: string[];
    options: (SelectOption<string> & { url: string })[];
    unique?: boolean;
    addLabel?: string;
    showUrl?: boolean;
  }>(),
  {
    unique: false,
    addLabel: 'Add new item',
    showUrl: true,
  }
);

const { editable } = useInjectEditMode();

const { addItems, updateItem } = useInjectActionTriggers<string>();

const itemSet = computed(() => new Set(props.items));

const getOptionsForItem = (item: string, itemSet: Set<string | number>) => {
  const allOptions = props.options.map((option) => ({
    ...option,
    selected: item === option.value,
  }));

  // If the unique option is set, we need to filter out options that are already selected
  if (props.unique) {
    return allOptions.filter(
      (option) =>
        // Filter out options that are already selected, except for the current tag
        option.selected || option.value == null || !itemSet.has(option.value)
    );
  }

  // If the unique option is not set, we can just return all options
  return allOptions;
};
</script>
