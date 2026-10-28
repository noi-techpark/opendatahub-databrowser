<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <tr v-for="rindex in rows" :key="rindex" class="w-full">
    <TableCell v-for="cindex in cells" :key="cindex">
      <div class="h-5 w-2/3 animate-pulse rounded-sm bg-gray-200"></div>
    </TableCell>
  </tr>
</template>

<script setup lang="ts">
import TableCell from './TableCell.vue';

withDefaults(
  defineProps<{
    rows?: number;
    cells?: number;
  }>(),
  {
    rows: 3,
    cells: 2,
  }
);
</script>
