<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="infos" :hide-tab-link="true" :hide-sortable="true">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-64" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Header</TableHeaderCell>
      <TableHeaderCell>Content</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }: { item: InfoEntry; index: number }">
      <TableCell>
        <StringCell
          :text="item.header"
          :editable="editable"
          @update="
            updateItem(index, { header: $event.value, content: item.content })
          "
        />
      </TableCell>
      <TableCell>
        <TextAreaCell
          :text="item.content"
          :rows="5"
          :editable="editable"
          @update="
            updateItem(index, { header: item.header, content: $event.value })
          "
        />
      </TableCell>
    </template>
    <template #noItems>No links have been defined yet</template>
    <template #addItems>
      <EditListAddButton
        :text="'Add new link'"
        @click="addItems([{ header: '', content: '' }])"
      />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import TextAreaCell from '../textAreaCell/TextAreaCell.vue';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { InfoEntry } from './types';
import { toRefs } from 'vue';
import { useRecordSupportForTable } from '../../utils/editList/support/useRecordSupport';
import StringCell from '../stringCell/StringCell.vue';

const props = defineProps<{ infos: InfoEntry[] }>();

const { infos } = toRefs(props);

const { editable } = useInjectEditMode();

const { addItems, updateItem } = useInjectActionTriggers<InfoEntry>();

useRecordSupportForTable({
  items: infos,
  duplication: (items, index) => ({ ...items[index], header: '' }),
});
</script>
