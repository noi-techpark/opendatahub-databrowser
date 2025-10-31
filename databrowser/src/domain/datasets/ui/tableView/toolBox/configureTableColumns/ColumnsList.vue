<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ul>
    <VueDraggableNext
      v-model="columns"
      handle=".handle"
      class="divide-y divide-gray-200"
      @change="emit('update:cols', columns)"
    >
      <li
        v-for="(column, index) in columns"
        :key="index"
        class="flex items-center justify-between gap-2 py-2"
      >
        <div class="flex items-center gap-2">
          <CheckboxCustom
            :model-value="!column.hidden"
            :label="column.title"
            @update:model-value="setColHidden(column, !$event)"
          ></CheckboxCustom>
          <div
            v-if="showDeprecatedInfo(column)"
            class="size-2 rounded-full bg-deprecated"
          ></div>
        </div>

        <div class="flex items-center gap-2">
          <ButtonCustom
            :size="Size.xs"
            :variant="Variant.ghost"
            class="px-2.5 py-1"
            @click="emit('edit:col', index)"
          >
            <IconEdit class="text-hint-info" />
          </ButtonCustom>

          <ButtonCustom
            :size="Size.xs"
            :variant="Variant.ghost"
            class="px-2.5 py-1"
            @click="deleteCol(index)"
          >
            <IconTrash class="text-delete" />
          </ButtonCustom>

          <button>
            <IconDragAndDrop class="handle text-hint-info" />
          </button>
        </div>
      </li>
    </VueDraggableNext>
  </ul>
</template>

<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '../../../../../../components/button/types';
import CheckboxCustom from '../../../../../../components/checkbox/CheckboxCustom.vue';
import IconDragAndDrop from '../../../../../../components/svg/IconDragAndDrop.vue';
import IconEdit from '../../../../../../components/svg/IconEdit.vue';
import IconTrash from '../../../../../../components/svg/IconTrash.vue';
import { PropertyConfig } from '../../../../config/types';
import { useToolBoxStore } from '../../../toolBox/toolBoxStore';

const emit = defineEmits<{
  (e: 'edit:col', index: number): void;
  (e: 'update:cols', value: PropertyConfig[]): void;
}>();

const columns = defineModel<PropertyConfig[]>('columns', {
  default: () => [],
});

const showDeprecatedInfo = (col: PropertyConfig) => {
  const showDeprecated = useToolBoxStore().settings.showDeprecated;
  const isDeprecated = col.deprecationInfo?.length ?? 0 > 0;
  return showDeprecated && isDeprecated;
};

const setColHidden = (col: PropertyConfig, hidden: boolean) => {
  col.hidden = hidden;
  emit('update:cols', columns.value);
};

const deleteCol = (index: number) => {
  columns.value.splice(index, 1);
  emit('update:cols', columns.value);
};
</script>
