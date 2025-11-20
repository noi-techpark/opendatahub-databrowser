<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="tags" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-80" />
      <col v-if="showAdditionalData" class="w-36 md:w-48" />
      <col v-if="showAdditionalData" class="w-16 md:w-20" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Tag name</TableHeaderCell>
      <TableHeaderCell v-if="showAdditionalData">Type</TableHeaderCell>
      <TableHeaderCell v-if="showAdditionalData">Source</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }: { item: string; index: number }">
      <TableCell>
        <SelectWithOptionsCell
          v-if="editable"
          :options="getOptionsForTag(item, tagSet)"
          :value="item"
          :show-empty-value="item == null"
          :editable="editable"
          @update="updateItem(index, $event.value)"
        />
        <!-- Show translated label if not in edit mode -->
        <span v-else>{{ getLabelForTag(item) }}</span>
      </TableCell>
      <TableCell v-if="showAdditionalData">
        <span>{{ getTagType(item) || '-' }}</span>
      </TableCell>
      <TableCell v-if="showAdditionalData">
        <span>{{ getTagSource(item) || '-' }}</span>
      </TableCell>
    </template>
    <template #noItems>No tags have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new'" @click="addItems([''])" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { SelectOption } from '../../../../../components/select/types';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';

type TagId = string;
interface TagData {
  Id: TagId;
  Type?: string | null;
  Source?: string | null;
}

const props = defineProps<{
  tags: string[];
  options: SelectOption[];
  unique: boolean;
  tagsData?: TagData[];
  showAdditionalData?: boolean;
}>();

const { tags, unique, tagsData, showAdditionalData } = toRefs(props);

const { addItems, updateItem } = useInjectActionTriggers<string>();

const { editable } = useInjectEditMode();

const tagSet = computed(() => new Set(tags.value));

const getOptionsForTag = (tag: string, tagSet: Set<string | number>) => {
  const allOptions = props.options.map((option) => ({
    ...option,
    selected: tag === option.value,
  }));

  // If the unique option is set, we need to filter out options that are already selected
  if (unique.value) {
    return allOptions.filter(
      (option) =>
        // Filter out options that are already selected, except for the current tag
        option.selected || option.value == null || !tagSet.has(option.value)
    );
  }

  // If the unique option is not set, we can just return all options
  return allOptions;
};

const getLabelForTag = (tag: string) =>
  props.options.find((option) => option.value === tag)?.label ?? tag;

const getTagData = (tagId: string) =>
  tagsData?.value?.find((t) => t.Id === tagId);

const getTagType = (tagId: string) =>
  getTagData(tagId)?.Type ?? '-';

const getTagSource = (tagId: string) =>
  getTagData(tagId)?.Source ?? '-';
</script>
