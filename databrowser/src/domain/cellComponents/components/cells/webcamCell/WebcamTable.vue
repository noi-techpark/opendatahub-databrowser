<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>Image</TableHeaderCell>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>URL</TableHeaderCell>
      <TableHeaderCell>Latitude</TableHeaderCell>
      <TableHeaderCell>Longitude</TableHeaderCell>
      <TableHeaderCell>Altitude</TableHeaderCell>
      <TableHeaderCell>Position</TableHeaderCell>
    </template>

    <template #tableCols="{ item }: { item: WebcamEntry }">
      <TableCell>
        <UseClickableFullscreen>
          <img :src="item.imageUrl" :alt="item.name" class="object-fit" />
        </UseClickableFullscreen>
      </TableCell>
      <TableCell>{{ item.name }}</TableCell>
      <TableCell>
        <UrlCell :text="item.imageUrl" :editable="editable" />
      </TableCell>
      <TableCell>{{ item.latitude }}</TableCell>
      <TableCell>{{ item.longitude }}</TableCell>
      <TableCell>{{ item.altitude }}</TableCell>
      <TableCell>{{ item.listPosition }}</TableCell>
    </template>
    <template #noItems>No webcams have been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new Webcam'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import UseClickableFullscreen from '../../../../../components/fullscreen/UseClickableFullscreen.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import UrlCell from '../UrlCell/UrlCell.vue';
import { WebcamEntry } from './types';

defineProps<{ items: WebcamEntry[] }>();

const { addItem } = useInjectActionTriggers<WebcamEntry>();

const { editable } = useInjectEditMode();
</script>
