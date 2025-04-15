<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">Event Dates {{ index + 1 }}</div>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new booking'" @click="addItem({})" />
    </template>

    <template #body="{ item, index }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-1/3">
          <SubCategoryItem title="From" :required="true">
            <DateCell
              type="datetime"
              :date="item.From"
              :editable="editable"
              @input="updateItem(index, { From: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Begin Time">
            <StringCell
              :text="item.Begin"
              :editable="editable"
              @input="updateItem(index, { Begin: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="To" :required="true">
            <DateCell
              type="datetime"
              :date="item.To"
              :editable="editable"
              @input="updateItem(index, { To: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="End Time">
            <StringCell
              :text="item.End"
              :editable="editable"
              @input="updateItem(index, { End: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Entrance Time">
            <StringCell
              :text="item.Entrance"
              :editable="editable"
              @input="updateItem(index, { Entrance: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Active">
            <ToggleTriStateCell
              :enabled="booleanOrStringToBoolean(item.Active)"
              :editable="editable"
              @input="updateItem(index, { Active: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="PriceFrom">
            <StringCell
              :text="item.PriceFrom"
              :editable="editable"
              @input="updateItem(index, { PriceFrom: $event.target.value })"
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
import DateCell from '../dateCell/DateCell.vue';
import { EventDateEntry } from './types';

defineProps<{ items: EventDateEntry[] }>();

const { addItem, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<EventDateEntry>();

const { editable } = useInjectEditMode();
</script>
