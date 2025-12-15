<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <InputSearch
      :variant="InputVariant.transparent"
      id="search-columns"
      v-model="searchTerm"
      class="flex w-full"
      :show-confirm-button="false"
    />

    <div class="flex items-center justify-between py-4 font-bold">
      <div>
        <span class="mr-1">{{ columnsVisibleCount }} </span>
        <span class="font-semibold text-dialog">
          {{
            t('datasets.listView.toolBox.columnConfiguration.columnsVisible')
          }}
        </span>
        <span class="ml-1">{{ columns.length }}</span>
      </div>
      <ButtonCustom
        :size="Size.xs"
        :variant="Variant.solid"
        :tone="Tone.white"
        @click="emit('add:column')"
        class="px-3 py-1 font-semibold flex items-center gap-2"
      >
        <IconAdd class="flex h-3 w-auto fill-current text-green-400" />
        <span class="flex">{{ t('datasets.listView.toolBox.columnConfiguration.addColumn') }}</span>
      </ButtonCustom>
    </div>

    <ToolBoxCard class="mx-0 my-0 bg-white">
      <ToolBoxCardBody class="p-0">
        <ul class="h-full max-h-[380px] overflow-y-auto px-5 py-4">
          <VueDraggableNext
            v-model="columns"
            handle=".handle"
            class="divide-y divide-gray-200"
            :sort="searchResults.length === columns.length"
            @change="emit('update:cols', columns)"
          >
            <li
              v-for="(column, index) in searchResults"
              :key="index"
              class="flex items-center justify-between gap-2 px-2 py-2"
            >
              <div class="flex items-start gap-2">
                <CheckboxCustom
                  :model-value="!column.hidden"
                  class="break-all"
                  :label="column.title"
                  @update:model-value="setColumnHidden(column, !$event)"
                ></CheckboxCustom>
                <span class="shrink-0 font-semibold text-gray-400"
                  >#{{ index + 1 }}</span
                >
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
                  @click="emit('edit:column', index)"
                >
                  <IconEdit class="text-hint-info" />
                </ButtonCustom>

                <ButtonCustom
                  :size="Size.xs"
                  :variant="Variant.ghost"
                  class="px-2.5 py-1"
                  @click="deleteColumn(index)"
                >
                  <IconTrash class="text-delete" />
                </ButtonCustom>

                <button :disabled="searchResults.length !== columns.length">
                  <IconDragAndDrop
                    class="text-hint-info"
                    :class="[
                      searchResults.length !== columns.length
                        ? 'opacity-50'
                        : 'handle',
                    ]"
                  />
                </button>
              </div>
            </li>
          </VueDraggableNext>
        </ul>

        <hr />
        <div class="flex flex-wrap items-center justify-between p-4">
          <CheckboxCustom
            :model-value="toggleAll.value"
            :indeterminate="toggleAll.indeterminate"
            :label="'Show/Hide all'"
            @update:model-value="
              columns.forEach((col) => setColumnHidden(col, !$event))
            "
          />

          <ButtonCustom
            :disabled="!canUndoLastChange"
            :size="Size.sm"
            :variant="Variant.transparent"
            @click="emit('reset:cols')"
            class="px-0 font-semibold uppercase text-dialog"
          >
            {{ t('datasets.listView.toolBox.columnConfiguration.reset') }}
          </ButtonCustom>
        </div>
      </ToolBoxCardBody>
    </ToolBoxCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Size, Tone, Variant } from '@/components/button/types';
import CheckboxCustom from '@/components/checkbox/CheckboxCustom.vue';
import InputSearch from '@/components/input/InputSearch.vue';
import IconDragAndDrop from '@/components/svg/IconDragAndDrop.vue';
import IconEdit from '@/components/svg/IconEdit.vue';
import IconTrash from '@/components/svg/IconTrash.vue';
import { PropertyConfig } from '../../../../config/types';
import { useToolBoxStore } from '../../../toolBox/toolBoxStore';
import { useColumnSearch } from './columnSearch';
import ToolBoxCardBody from '@/domain/datasets/ui/toolBox/ToolBoxCardBody.vue';
import ToolBoxCard from '@/domain/datasets/ui/toolBox/ToolBoxCard.vue';
import { injectColumnConfiguration } from '@/domain/datasets/ui/tableView/toolBox/configureTableColumns/columnConfiguration';
import { Variant as InputVariant } from '@/components/input/types';
import IconAdd from '@/components/svg/IconAdd.vue';

const { t } = useI18n();

const { canUndoLastChange } = injectColumnConfiguration();

const emit = defineEmits<{
  (e: 'add:column'): void;
  (e: 'edit:column', index: number): void;
  (e: 'update:cols', value: PropertyConfig[]): void;
  (e: 'reset:cols'): void;
}>();

const columns = defineModel<PropertyConfig[]>('columns', {
  default: () => [],
});

const columnsVisibleCount = computed(() => {
  return columns.value.filter((column) => !column.hidden).length;
});

const showDeprecatedInfo = (col: PropertyConfig) => {
  const showDeprecated = useToolBoxStore().settings.showDeprecated;
  const isDeprecated = col.deprecationInfo?.length ?? 0 > 0;
  return showDeprecated && isDeprecated;
};

const setColumnHidden = (col: PropertyConfig, hidden: boolean) => {
  col.hidden = hidden;
  emit('update:cols', columns.value);
};

const deleteColumn = (index: number) => {
  columns.value.splice(index, 1);
  emit('update:cols', columns.value);
};

const { searchTerm, searchResults } = useColumnSearch(columns);

const toggleAll = computed(() => {
  const visible = columns.value.filter((column) => !column.hidden).length;
  const total = columns.value.length;
  const value = visible === total;
  const indeterminate = visible > 0 && visible < total;

  return {
    value,
    indeterminate,
  };
});
</script>
