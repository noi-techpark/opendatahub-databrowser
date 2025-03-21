<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <span> GPS Point {{ index + 1 }}</span>
    </template>

    <template #addItems>
      <EditListAddButton
        :text="'Add new GPS Point'"
        @click="addItems([{ unitMeasureAltitude: 'm' }])"
      />
    </template>

    <template #body="{ item, index }: { item: GpsInfoEntry; index: number }">
      <div class="flex flex-wrap gap-8 lg:flex-nowrap">
        <div class="basis-full" :class="{ 'lg:basis-3/4': editable }">
          <EditGpsPointMap
            :key="`map_${activeTab}_${items.length}`"
            :data="item"
            @new-position="onNewPosition(index, $event)"
          />
        </div>
        <div v-if="editable" class="basis-full lg:basis-1/4">
          <div class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Info &amp; action</span>
            </div>
            <div class="divide-y p-4">
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
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';

import { GpsInfoEntry } from './types';
import EditGpsPointMap from './EditGpsPointMap.vue';

defineProps<{ items: GpsInfoEntry[] }>();

const { activeTab } = useInjectNavigation();

const { deleteItems, duplicateItem, updateItem, addItems } =
  useInjectActionTriggers<GpsInfoEntry>();

const { editable } = useInjectEditMode();

const onNewPosition = (index: number, data: GpsInfoEntry) => {
  updateItem(index, data);
};
</script>
