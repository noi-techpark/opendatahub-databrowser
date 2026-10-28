<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ item, index }">
      <span>{{ getLabel(item, index) }}</span>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new video'" @click="navigateToAdd" />
    </template>

    <template #body="{ item, index }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:basis-2/3">
          <SubCategoryItem title="Name">
            <StringCell
              :text="item.name"
              :editable="editable"
              @input="updateItem(index, { name: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Url">
            <StringCell
              :text="item.url"
              :editable="editable"
              @input="updateItem(index, { url: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Video source">
            <StringCell
              :text="item.videoSource"
              :editable="editable"
              @input="updateItem(index, { videoSource: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Video type">
            <StringCell
              :text="item.videoType"
              :editable="editable"
              @input="updateItem(index, { videoType: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Streaming source">
            <StringCell
              :text="item.streamingSource"
              :editable="editable"
              @input="
                updateItem(index, { streamingSource: $event.target.value })
              "
            />
          </SubCategoryItem>
          <SubCategoryItem title="Video title">
            <StringCell
              :text="item.videoTitle"
              :editable="editable"
              @input="updateItem(index, { videoTitle: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Video description">
            <StringCell
              :text="item.videoDesc"
              :editable="editable"
              @input="updateItem(index, { videoDesc: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Active">
            <ToggleTriStateCell
              :enabled="booleanOrStringToBoolean(item.active)"
              :editable="editable"
              @input="updateItem(index, { active: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Copyright">
            <StringCell
              :text="item.copyright"
              :editable="editable"
              @input="updateItem(index, { copyright: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="License">
            <StringCell
              :text="item.license"
              :editable="editable"
              @input="updateItem(index, { license: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="License holder">
            <StringCell
              :text="item.licenseHolder"
              :editable="editable"
              @input="updateItem(index, { licenseHolder: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Language">
            <StringCell :text="item.language" :editable="false" />
          </SubCategoryItem>
          <SubCategoryItem>
            <StringCell
              :text="item.width"
              :editable="editable"
              @input="updateItem(index, { width: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Height">
            <StringCell
              :text="item.height"
              :editable="editable"
              @input="updateItem(index, { height: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Bitrate">
            <StringCell
              :text="item.bitrate"
              :editable="editable"
              @input="updateItem(index, { bitrate: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Duration">
            <StringCell
              :text="item.duration"
              :editable="editable"
              @input="updateItem(index, { duration: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Definition">
            <StringCell
              :text="item.definition"
              :editable="editable"
              @input="updateItem(index, { definition: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Resolution">
            <StringCell
              :text="item.resolution"
              :editable="editable"
              @input="updateItem(index, { resolution: $event.target.value })"
            />
          </SubCategoryItem>
        </div>
        <div class="basis-full md:basis-1/3">
          <div class="rounded-sm border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Info &amp; action</span>
            </div>
            <div class="divide-y p-4">
              <div class="mb-3 font-semibold">
                <div>Resolution</div>
                <div class="text-black">
                  {{ getResolutionAsText(item) }} (W/H)
                </div>
              </div>
              <div v-if="editable">
                <button
                  class="m-3 flex items-center gap-3"
                  @click="duplicateItem(index)"
                >
                  <IconCopy class="text-green-500" />
                  <span>Duplicate</span>
                </button>
              </div>
              <div v-if="editable">
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
import { toRefs } from 'vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import { getResolutionAsText } from '../../../../image';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import StringCell from '../stringCell/StringCell.vue';
import ToggleTriStateCell from '../toggleCell/ToggleTriStateCell.vue';
import { VideoItemsEntry } from './types';

const props = defineProps<{ items: VideoItemsEntry[] }>();

const { items } = toRefs(props);

const { navigateToAdd } = useInjectNavigation();

const { deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<VideoItemsEntry>();

const { editable } = useInjectEditMode();

const getLabel = (item: VideoItemsEntry, index: number) =>
  item.name != null && item.name?.length > 0 ? item.name : `Video ${index + 1}`;
</script>
