<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">Webcam {{ index + 1 }}</div>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new Webcam'" @click="addItem({})" />
    </template>

    <template #body="{ item, index }: { item: WebcamEntry; index: number }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-1/3">
          <SubCategoryItem title="Name">
            <StringCell
              :text="item.name"
              :editable="editable"
              @input="updateItem(index, { name: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="URL">
            <StringCell
              :text="item.imageUrl"
              :editable="editable"
              @input="updateItem(index, { imageUrl: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Latitude">
            <StringCell
              :text="item.latitude"
              :editable="editable"
              @input="updateItem(index, { latitude: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Longitude">
            <StringCell
              :text="item.longitude"
              :editable="editable"
              @input="updateItem(index, { longitude: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Altitude">
            <StringCell
              :text="item.altitude"
              :editable="editable"
              @input="updateItem(index, { altitude: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Position">
            <StringCell
              :text="item.listPosition"
              :editable="editable"
              @input="updateItem(index, { listPosition: $event.target.value })"
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
                  @click="downloadFile(item.imageUrl, item.name)"
                >
                  <IconDownload class="text-green-500" />
                  <span>Download image</span>
                </button>
              </div>
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
        <div class="basis-full md:order-2 md:basis-1/3">
          <div class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Preview of image</span>
              <button @click="toggle()">
                <IconExpanded
                  class="cursor-pointer text-green-500 transition-all hover:scale-125"
                />
              </button>
            </div>

            <div ref="target" class="flex justify-center">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                :class="{
                  'object-contain': isFullscreen,
                  'rounded-b': !isFullscreen,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { ref } from 'vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import IconDownload from '../../../../../components/svg/IconDownload.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { downloadFile } from '../../utils/editList/download/fileDownload';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import StringCell from '../stringCell/StringCell.vue';
import { WebcamEntry } from './types';

defineProps<{ items: WebcamEntry[] }>();

const { addItem, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<WebcamEntry>();

const { editable } = useInjectEditMode();

const target = ref();
const { toggle, isFullscreen } = useFullscreen(target);
</script>
