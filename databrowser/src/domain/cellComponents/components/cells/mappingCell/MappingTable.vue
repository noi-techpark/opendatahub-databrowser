<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="mappings" :hide-tab-link="true">
    <template #colGroup>
      <col class="w-32 md:w-32" />
      <col class="w-32 md:w-48" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>
        {{ t('components.mappingTable.headerCol1') }}
      </TableHeaderCell>
      <TableHeaderCell>
        {{ t('components.mappingTable.headerCol2') }}
      </TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }">
      <TableCell>
        <div class="flex gap-2">
          <StringCell
            :text="item.key"
            :editable="editable"
            :placeholder="t('components.mappingTable.placeholderParentKey')"
            @update="updateParentKey(index, item, $event.value)"
          />
        </div>
      </TableCell>
      <TableCell class="flex flex-col gap-2">
        <div
          v-for="({ key, value }, childItemIndex) in item.value"
          :key="childItemIndex"
          class="flex items-center gap-2"
        >
          <StringCell
            :text="key"
            :editable="editable"
            :placeholder="t('components.mappingTable.placeholderChildKey')"
            @update="updateChildKey(index, childItemIndex, item, $event.value)"
          />
          =
          <StringCell
            :text="value"
            :editable="editable"
            :placeholder="t('components.mappingTable.placeholderChildValue')"
            @update="updateChildValue(index, item, key, $event.value)"
          />
          <button v-if="editable" @click="deleteChildKey(index, item, key)">
            <IconDelete class="text-delete" />
          </button>
        </div>
        <div v-if="editable" class="mt-2 flex justify-center">
          <ButtonCustom :size="Size.sm" @click="addChildKey(index, item)">
            {{ t('components.mappingTable.addKeyValue') }}
          </ButtonCustom>
        </div>
      </TableCell>
    </template>
    <template #noItems>
      {{ t('components.mappingTable.noData') }}
    </template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new'"
        @click="
          addItems([
            {
              key: '',
              value: [{ key: '', value: '' }],
            },
          ])
        "
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import { toRefs, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../components/button/types';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { useRecordSupportForTable } from '../../utils/editList/support/useRecordSupport';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import StringCell from '../stringCell/StringCell.vue';
import { Mapping } from './types';

const { t } = useI18n();

const props = defineProps<{ mappings: Mapping[] }>();

const { mappings } = toRefs(props);

const { editable } = useInjectEditMode();

const { addItems, updateItem } = useInjectActionTriggers<Mapping>();

const addChildKey = (index: number, item: Mapping) => {
  const nextItem: Mapping = {
    ...item,
    value: [...item.value, { key: '', value: '' }],
  };
  updateItem(index, nextItem);
};

const updateParentKey = (index: number, item: Mapping, key: string) => {
  const nextItem = { key, value: item.value };
  updateItem(index, nextItem);
};

const updateChildKey = (
  index: number,
  childItemIndex: number,
  item: Mapping,
  newKey: string
) => {
  const nextItem = { ...item };
  nextItem.value[childItemIndex].key = newKey;
  updateItem(index, nextItem);
};

const updateChildValue = (
  index: number,
  item: Mapping,
  key: string,
  value: string
) => {
  const nextItem: Mapping = { ...item, value: [...item.value, { key, value }] };
  updateItem(index, nextItem);
};

const deleteChildKey = (index: number, item: Mapping, key: string) => {
  const nextItem = { ...item, value: item.value.filter((v) => v.key !== key) };
  updateItem(index, nextItem);
};

useRecordSupportForTable<Mapping>({
  items: mappings,
  duplication: (items, index) => {
    const { value } = items[index];
    // Deep clone the child entries (unwrap Vue proxy first)
    const childEntries = structuredClone(toRaw(value));

    // Set the key to an empty string, so that the user can enter a new one
    return {
      key: '',
      value: childEntries,
    };
  },
});
</script>
