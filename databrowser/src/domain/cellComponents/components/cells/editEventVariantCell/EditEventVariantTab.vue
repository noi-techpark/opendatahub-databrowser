<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">Event Variant {{ index + 1 }}</div>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new variant'" @click="addItem({})" />
    </template>

    <template #body="{ item, index }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-1/3">
          <SubCategoryItem title="Name">
            <StringCell
              :text="item.Name"
              :editable="editable"
              @input="updateItem(index, { Name: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Price">
            <StringCell
              :text="item.Price"
              :editable="editable"
              @input="updateItem(index, { Price: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="VariantId">
            <StringCell
              :text="item.VariantId"
              :editable="editable"
              @input="updateItem(index, { VariantId: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="VariantCategoryId">
            <StringCell
              :text="item.VariantCategoryId"
              :editable="editable"
              @input="
                updateItem(index, { VariantCategoryId: $event.target.value })
              "
            />
          </SubCategoryItem>
          <SubCategoryItem title="IsStandard">
            <ToggleTriStateCell
              :enabled="booleanOrStringToBoolean(item.IsStandard)"
              :editable="editable"
              @input="updateItem(index, { IsStandard: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Order">
            <StringCell
              :text="item.Order"
              :editable="editable"
              @input="updateItem(index, { Order: $event.target.value })"
            />
          </SubCategoryItem>
        </div>
        <div class="basis-full md:order-3 md:basis-1/3">
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
        <div class="basis-full md:order-2 md:basis-1/3"></div>
      </div>
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import StringCell from '../stringCell/StringCell.vue';
import { EventVariantEntry } from './types';

defineProps<{ items: EventVariantEntry[] }>();

const { addItem, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<EventVariantEntry>();

const { editable } = useInjectEditMode();
</script>
