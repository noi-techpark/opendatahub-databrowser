<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">PushConfig {{ index + 1 }}</div>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new PushConfig'" @click="addItem({})" />
    </template>

    <template #body="{ item, index }: { item: PushConfigEntry; index: number }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-2/3">
          <SubCategoryItem title="BaseUrl">
            <StringCell
              :text="item.baseurl"
              :editable="editable"
              @input="updateItem(index, { baseurl: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="PathParam">
            <div
              v-for="(value, pathparamIndex) in item.pathparam"
              :key="pathparamIndex"
              class="flex flex-col"
            >
              <div class="flex gap-2">
                <StringCell
                  :text="value"
                  :editable="editable"
                  placeholder="Path param"
                  @update="
                    updatePathparamItem(
                      index,
                      item,
                      pathparamIndex,
                      $event.value
                    )
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
            <EditListAddButton
              v-if="editable"
              class="mt-6"
              text="Add path param"
              @click="addPathparamItem(index, item)"
            />
          </SubCategoryItem>
          <SubCategoryItem title="PushApiUrl">
            <StringCell :text="item.pushapiurl" :editable="false" />
          </SubCategoryItem>
        </div>
        <div class="basis-full md:order-2 md:basis-1/3">
          <div v-if="editable" class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Info &amp; action</span>
            </div>
            <div class="divide-y p-4">
              <div>
                <button
                  class="m-3 flex items-center gap-3"
                  @click="duplicateItem(index)"
                >
                  <IconCopy class="text-green-500" />
                  <span>Duplicate</span>
                </button>
              </div>
              <div>
                <button
                  class="mx-3 mt-3 flex items-center gap-3"
                  @click="deleteItems([index])"
                >
                  <IconDelete class="text-delete" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import StringCell from '../stringCell/StringCell.vue';
import { PushConfigEntry } from './types';

defineProps<{ items: PushConfigEntry[] }>();

const { addItem, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<PushConfigEntry>();

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
