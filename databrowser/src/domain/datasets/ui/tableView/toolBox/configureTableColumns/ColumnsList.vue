<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ul>
    <VueDraggableNext
      v-model="cols"
      handle=".handle"
      class="divide-y divide-gray-200"
      @change="emit('update:cols', cols)"
    >
      <li
        v-for="(col, index) in cols"
        :key="index"
        class="flex items-center justify-between gap-2 py-2"
      >
        <div class="flex items-center gap-2">
          <CheckboxCustom
            :model-value="!col.hidden"
            :label="col.title"
            @update:model-value="setColHidden(col, !$event)"
          ></CheckboxCustom>
          <div
            v-if="showDeprecatedInfo(col)"
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

const cols = defineModel<PropertyConfig[]>('cols', {
  default: () => [],
});

const showDeprecatedInfo = (col: PropertyConfig) => {
  const showDeprecated = useToolBoxStore().settings.showDeprecated;
  const isDeprecated = col.deprecationInfo?.length ?? 0 > 0;
  return showDeprecated && isDeprecated;
};

const setColHidden = (col: PropertyConfig, hidden: boolean) => {
  col.hidden = hidden;
  emit('update:cols', cols.value);
};

const deleteCol = (index: number) => {
  cols.value.splice(index, 1);
  emit('update:cols', cols.value);
};
</script>
