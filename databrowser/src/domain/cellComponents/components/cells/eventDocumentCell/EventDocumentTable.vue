<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-60" />
      <col class="w-32 md:w-28" />
      <col class="w-32 md:w-60" />
    </template>
    <template #tableHeader>
      <TableHeaderCell>URL</TableHeaderCell>
      <TableHeaderCell>Language</TableHeaderCell>
      <TableHeaderCell>Document Name</TableHeaderCell>
    </template>

    <template #tableCols="{ item, index }: { item: FileEntry; index: number }">
      <TableCell>
        <UrlCell :text="item.src" :editable="false" />
      </TableCell>
      <TableCell>
        <StringCell
          :text="getCurrentDocumentLanguageAvailability(item)"
          :editable="false"
        />
      </TableCell>
      <TableCell>
        <StringCell
          :text="item.documentName"
          :editable="editable"
          @update="
            updateItem(index, {
              documentName: $event.value,
              src: item.src,
              language: item.language,
            })
          "
        />
      </TableCell>
    </template>
    <template #noItems>No files have been uploaded yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new PDF'" @click="navigateToAdd" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import UrlCell from '../UrlCell/UrlCell.vue';
import StringCell from '../stringCell/StringCell.vue';
import { FileEntry } from './types';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { getCurrentDocumentLanguageAvailability } from '../../utils/editList/dialogMultipleFilesLanguage/utils';

defineProps<{ items: FileEntry[] }>();

const { navigateToAdd } = useInjectNavigation();

const { editable } = useInjectEditMode();

const { updateItem } = useInjectActionTriggers<FileEntry>();
</script>
