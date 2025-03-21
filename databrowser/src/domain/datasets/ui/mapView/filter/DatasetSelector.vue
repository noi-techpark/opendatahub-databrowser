<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ul class="divide-y">
    <li v-for="parent in items" :key="parent.id">
      <div class="flex items-center justify-between p-2">
        <DatasetSelectorItem
          :item="parent"
          @toggle-dataset="emit('toggleDataset', $event)"
        />
        <ButtonCustom
          v-if="parent.children?.length > 0"
          :size="Size.xs"
          :variant="Variant.ghost"
          class="self-start border-none px-2.5 py-2"
          @click="toggleParent(parent.id)"
        >
          <ArrowLine
            :class="[
              openParents[parent.id] === true ? '-rotate-90' : 'rotate-90',
            ]"
          />
        </ButtonCustom>
      </div>
      <ul
        v-if="parent.children?.length > 0 && openParents[parent.id] === true"
        class="ml-4 divide-y"
      >
        <li v-for="child in parent.children" :key="child.id" class="p-2">
          <DatasetSelectorItem
            :item="child"
            @toggle-dataset="emit('toggleDataset', $event)"
          />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '../../../../../components/button/types';
import ArrowLine from '../../../../../components/svg/ArrowLine.vue';
import DatasetSelectorItem from './DatasetSelectorItem.vue';
import { SelectDatasetItem } from './types';

const emit = defineEmits<{
  (e: 'toggleDataset', datasetId: string): void;
}>();

const props = defineProps<{ items: SelectDatasetItem[] }>();

const { items } = toRefs(props);

const openParents = ref<Record<string, boolean>>({});

const toggleParent = (id: string) => {
  const opened = !openParents.value[id];
  openParents.value = { ...openParents.value, [id]: opened };
};
</script>
