<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>BaseUrl</TableHeaderCell>
      <TableHeaderCell>PathParam</TableHeaderCell>
      <TableHeaderCell>PushApiUrl</TableHeaderCell>
    </template>

    <template
      #tableCols="{ item, index }: { item: PushConfigEntry; index: number }"
    >
      <TableCell>
        <StringCell
          :text="item.baseurl"
          :editable="editable"
          @update="updateItem(index, { ...item, baseurl: $event.value })"
        />
      </TableCell>
      <TableCell>
        <div
          v-for="(value, pathparamIndex) in item.pathparam"
          :key="pathparamIndex"
          class="flex flex-col items-center gap-2"
        >
          <div class="flex gap-2">
            <StringCell
              :text="value"
              :editable="editable"
              placeholder="Path param"
              @update="
                updatePathparamItem(index, item, pathparamIndex, $event.value)
              "
            />
            <button
              v-if="editable"
              @click="deletePathparamItem(index, item, pathparamIndex)"
            >
              <IconDelete class="text-delete" />
            </button>
          </div>
        </div>
        <div v-if="editable" class="mt-2 flex justify-center">
          <ButtonCustom :size="Size.sm" @click="addPathparamItem(index, item)">
            Add path param
          </ButtonCustom>
        </div>
      </TableCell>
      <TableCell>
        <UrlCell :text="item.pushapiurl" :editable="false" />
      </TableCell>
    </template>
    <template #noItems>No pushconfig have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new Pushconfig'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { PushConfigEntry } from './types';
import UrlCell from '../UrlCell/UrlCell.vue';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import StringCell from '../stringCell/StringCell.vue';
import { Size } from '../../../../../components/button/types';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';

defineProps<{ items: PushConfigEntry[] }>();

const { addItem, updateItem } = useInjectActionTriggers<PushConfigEntry>();

const { editable } = useInjectEditMode();

const addPathparamItem = (index: number, item: PushConfigEntry) => {
  const newPathparam = item.pathparam == null ? [''] : [...item.pathparam, ''];
  const newItem = { ...item, pathparam: newPathparam };
  updateItem(index, newItem);
};

const updatePathparamItem = (
  index: number,
  item: PushConfigEntry,
  pathparamIndex: number,
  value: string
) => {
  if (item.pathparam == null) {
    // Should never happen, because we always add a pathparam before updating it
    return;
  }
  item.pathparam[pathparamIndex] = value;
  updateItem(index, { ...item });
};

const deletePathparamItem = (
  index: number,
  item: PushConfigEntry,
  pathparamIndex: number
) => {
  if (item.pathparam == null || pathparamIndex >= item.pathparam.length) {
    // Should never happen, because we always add a pathparam before updating it
    // and pathparamIndex is always valid
    return;
  }

  const newPathparam = [...item.pathparam];
  newPathparam.splice(pathparamIndex, 1);
  const newItem = { ...item, pathparam: newPathparam };

  updateItem(index, newItem);
};
</script>
