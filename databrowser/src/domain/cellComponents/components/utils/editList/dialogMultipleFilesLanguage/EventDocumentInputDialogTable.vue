<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListDocumentLanguagesTable
    :items="items"
    hide-sortable
    hide-tab-link
    has-body-scrollable
    label-key="language"
  >
    <template #colGroup>
      <col class="w-32 md:w-60" />
    </template>
    <template #tableHeader>
      <TableHeaderCell>Document Name</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }: { item: FileEntry; index: number }">
      <TableCell>
        <StringCell
          :text="item.documentName"
          :editable="true"
          @update="
            update(index, {
              documentName: $event.value,
              language: item.language,
            })
          "
        />
      </TableCell>
    </template>
    <template #noItems>No files have been uploaded yet</template>
  </EditListDocumentLanguagesTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../../components/table/TableCell.vue';
import StringCell from '../../../cells/stringCell/StringCell.vue';

import EditListDocumentLanguagesTable from './EditListDocumentLanguagesTable.vue';
import { FileEntry } from '../../../cells/eventDocumentCell/types';

import { updateItem } from './utils';
import { FileLanguageUpdate } from './types';

defineProps<{ items: FileEntry[] }>();

const update = (index: number, value: FileLanguageUpdate) => {
  updateItem(index, value);
};
</script>
