<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="localItems" hide-settings-column>
    <template #colGroup>
      <col class="w-48 md:w-96" />
      <col class="w-48 md:w-60" />
      <col v-if="editable" class="w-20" />
    </template>

    <template #tableHeader>
      <TableHeaderCell class="uppercase">
        {{ t('components.additionalProperties.table.additionalProperty') }}
      </TableHeaderCell>
      <TableHeaderCell class="uppercase">
        {{ t('components.additionalProperties.table.link') }}
      </TableHeaderCell>
      <TableHeaderCell v-if="editable" class="uppercase">
        {{ t('components.additionalProperties.table.settings') }}
      </TableHeaderCell>
    </template>

    <template
      #tableCols="{
        item,
        index,
      }: {
        item: AdditionalPropertiesOptions;
        index: number;
      }"
    >
      <TableCell>
        <SelectWithOptionsCell
          v-if="editable"
          :key="`${confirmStore.visible}_${index}`"
          :value="item.value"
          :editable="editable"
          :options="availableAdditionalPropertiesOptions"
          @update="($event) => onUpdate($event.value, index, item)"
        />
        <span v-else>{{ item.label }}</span>
      </TableCell>
      <TableCell>
        <InternalLink
          :to="{
            hash: `#${item.slug}`,
            query: router.currentRoute.value.query,
          }"
        >
          {{ item.label }}
        </InternalLink>
      </TableCell>
      <TableCell v-if="editable">
        <ButtonCustom
          variant="ghost"
          tone="danger"
          class="!p-2"
          @click="deleteItems([index])"
          ><IconDelete
        /></ButtonCustom>
      </TableCell>
    </template>
    <template #noItems>
      {{ t('components.additionalProperties.noAdditionalProperty') }}
    </template>
    <template #addItems>
      <EditListAddButton
        :text="t('components.additionalProperties.addAdditionalProperty')"
        :disabled="items.length === 1"
        @click="onAdd()"
      />
    </template>
  </EditListTable>
  <ConfirmChangeAdditionalPropertyDialog
    @confirm="onConfirmUpdate"
    @undo="onUndoUpdate"
  />
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import {
  AdditionalPropertiesOptions,
  availableAdditionalPropertiesOptions,
} from './propertyOptions';
import { useI18n } from 'vue-i18n';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import InternalLink from '../../../../../components/link/InternalLink.vue';
import ConfirmChangeAdditionalPropertyDialog from './confirmChangeAdditionalPropertyDialog/ConfirmChangeAdditionalPropertyDialog.vue';

import { useRouter } from 'vue-router';
import { useConfirmChangeAdditionalPropertyDialogStore } from './confirmChangeAdditionalPropertyDialog/confirmChangeAdditionalPropertyDialogStore';
import { ref, watch } from 'vue';

const emit = defineEmits(['add']);

const confirmStore = useConfirmChangeAdditionalPropertyDialogStore();

const router = useRouter();
const { t } = useI18n();

const props = defineProps<{ items: AdditionalPropertiesOptions[] }>();

const localItems = ref<AdditionalPropertiesOptions[]>([]);

const { updateItem, deleteItems } =
  useInjectActionTriggers<AdditionalPropertiesOptions>();

const { editable } = useInjectEditMode();

const onAdd = () => {
  emit('add');
};

const onUpdate = (
  value: string,
  index: number,
  item: AdditionalPropertiesOptions
) => {
  confirmStore.setCurrentItem(item);
  confirmStore.setCurrentItemIndex(index);
  confirmStore.setNewValue(value);
  confirmStore.show();
};

const onConfirmUpdate = () => {
  updateItem(confirmStore.currentItemIndex, {
    ...confirmStore.currentItem,
    value: confirmStore.newValue,
  });

  confirmStore.hide();
};

const onUndoUpdate = () => {
  localItems.value[confirmStore.currentItemIndex].value =
    confirmStore.currentItem.value;

  confirmStore.hide();
};

watch(
  () => props.items,
  (newVal) => {
    localItems.value = JSON.parse(JSON.stringify(newVal));
  }
);
</script>
