<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTable :items="items">
    <template #colGroup>
      <col class="w-32 md:w-40" />
      <col class="w-16 md:w-24" />
      <col class="w-16 md:w-24" />
      <col class="w-32 md:w-40" />
      <col class="w-32 md:w-40" />
    </template>

    <template #tableHeader>
      <TableHeaderCell>MAP</TableHeaderCell>
      <TableHeaderCell>Type</TableHeaderCell>
      <TableHeaderCell>Format</TableHeaderCell>
      <TableHeaderCell>Url</TableHeaderCell>
      <TableHeaderCell>Description</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <GpsTrackMap
          v-if="item.GpxTrackUrl"
          class="h-24"
          :track-url="item.GpxTrackUrl"
          :prevent-interaction="true"
          :fullscreen-on-click="true"
        />
        <div v-else class="text-sm text-gray-500">No URL</div>
      </TableCell>
      <TableCell>
        <StringCell :text="item.Type" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.Format" />
      </TableCell>
      <TableCell>
        <UrlCell :text="item.GpxTrackUrl" :editable="false" />
      </TableCell>
      <TableCell>
        <StringCell :text="item.GpxTrackDesc" />
      </TableCell>
    </template>
    <template #noItems>No gpstrack has been defined yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new gpstrack data'" @click="addItem({})" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import StringCell from '../stringCell/StringCell.vue';
import UrlCell from '../UrlCell/UrlCell.vue';
import { GpsTrackEntry } from './types';
import GpsTrackMap from './GpsTrackMap.vue';

defineProps<{ items: GpsTrackEntry[] }>();

const { addItem } = useInjectActionTriggers<GpsTrackEntry>();
</script>
