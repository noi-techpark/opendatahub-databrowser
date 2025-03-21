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
      <col class="w-20 md:w-28" />
    </template>
    <template #tableHeader>
      <TableHeaderCell>IMAGE</TableHeaderCell>
      <TableHeaderCell>POSITION</TableHeaderCell>
      <TableHeaderCell>Titel</TableHeaderCell>
      <TableHeaderCell>Description</TableHeaderCell>
      <TableHeaderCell>Copyright</TableHeaderCell>
      <TableHeaderCell>License</TableHeaderCell>
      <TableHeaderCell>Resolution</TableHeaderCell>
    </template>

    <template #tableCols="{ item }">
      <TableCell>
        <UseClickableFullscreen v-slot="{ isFullscreen }">
          <img
            :src="
              getImageSrc(item.src, {
                resize: shouldResize(isFullscreen, resizeImages),
                preferredWidth: 200,
              })
            "
            :alt="item.alt"
            class="object-fit"
          />
        </UseClickableFullscreen>
      </TableCell>
      <TableCell>{{ item.listPosition }}</TableCell>
      <TableCell>{{ item.title }}</TableCell>
      <TableCell>{{ item.description }}</TableCell>
      <TableCell>{{ item.copyright }}</TableCell>
      <TableCell>{{ item.license }}</TableCell>
      <TableCell>{{ getResolutionAsText(item) }}</TableCell>
    </template>
    <template #noItems>No images have been uploaded yet</template>
    <template #addItems>
      <EditListAddButton :text="'Add new image'" @click="navigateToAdd" />
    </template>
  </EditListTable>
</template>

<script setup lang="ts">
import UseClickableFullscreen from '../../../../../components/fullscreen/UseClickableFullscreen.vue';
import TableCell from '../../../../../components/table/TableCell.vue';
import TableHeaderCell from '../../../../../components/table/TableHeaderCell.vue';
import { getImageSrc, getResolutionAsText } from '../../../../image';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import EditListTable from '../../utils/editList/table/EditListTable.vue';
import { ImageGalleryEntry } from './types';
import { shouldResize } from './utils';

defineProps<{ items: ImageGalleryEntry[]; resizeImages: boolean }>();

const { navigateToAdd } = useInjectNavigation();
</script>
