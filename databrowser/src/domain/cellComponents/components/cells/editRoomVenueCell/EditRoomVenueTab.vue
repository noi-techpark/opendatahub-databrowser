<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">Room {{ index + 1 }}</div>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new room'" @click="addItem({})" />
    </template>

    <template #body="{ item, index }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-1/3">
          <SubCategoryItem title="Id" :required="true">
            <StringCell
              :text="item.Id"
              :editable="false"
              :readonly="true"
              @input="updateItem(index, { Id: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Shortname" :required="true">
            <StringCell
              :text="item.Shortname"
              :editable="false"
              :readonly="true"
              @input="updateItem(index, { Shortname: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Title" :required="true">
            <StringCell
              :text="item.Detail?.[language]?.Title"
              :editable="editable"
              @input="updateItem(index, { Detail: { ...(item.Detail ?? {}), [language]: { ...(item.Detail?.[language] ?? {}), Title: $event.target.value } } })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Active" :required="true">
            <ToggleTriStateCell
              :enabled="booleanOrStringToBoolean(item.Active)"
              :editable="editable"
              @input="updateItem(index, { Active: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="SquareMeters">
            <StringCell
              :text="item.VenueRoomProperties?.SquareMeters"
              :editable="editable"
              @input="updateItem(index, { VenueRoomProperties: { ...(item.VenueRoomProperties ?? {}), SquareMeters: $event.target.value } })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Capacity">
            <StringCell
              :text="item.MaxCapacity ?? undefined"
              :editable="editable"
              type="number"
              @input="updateItem(index, { MaxCapacity: toCapacity($event.target.value) })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Placement">
            <StringCell
              :text="item.Placement"
              :editable="editable"
              @input="updateItem(index, { Placement: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Mapping">
            <MappingCell
              :mapping="item.Mapping"
              :editable="editable"
              @update="updateItem(index, { Mapping: $event.value })"
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
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import MappingCell from '../mappingCell/MappingCell.vue';
import StringCell from '../stringCell/StringCell.vue';
import ToggleTriStateCell from '../toggleCell/ToggleTriStateCell.vue';
import { computed } from 'vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import { useDatasetQueryStore } from '../../../../datasets/location/store/datasetQueryStore';
import { RoomVenueEntry } from './types';

defineProps<{ items: RoomVenueEntry[] }>();

const { addItem, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<RoomVenueEntry>();

const { editable } = useInjectEditMode();

// MaxCapacity is an integer in the API, an empty input clears it
const toCapacity = (value: string): number | null =>
  value === '' ? null : Number(value);

const language = computed(() => useDatasetQueryStore().handle('language').value ?? 'en');
</script>
