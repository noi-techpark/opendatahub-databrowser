<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TableCustom :id="id" class="overflow-y-auto pb-12 md:pb-0">
    <colgroup v-if="isColgroupColsSlotDefined">
      <slot name="colgroup-cols"></slot>
    </colgroup>
    <TableHeader v-if="isHeaderColsSlotDefined" class="sticky top-0 z-10">
      <slot name="header-cols"></slot>
    </TableHeader>
    <TableBody v-if="isBodyRowsSlotDefined">
      <slot name="body-rows"></slot>
    </TableBody>
  </TableCustom>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
import TableBody from './TableBody.vue';
import TableHeader from './TableHeader.vue';
import TableCustom from './TableCustom.vue';
import { randomId } from '../utils/random';

withDefaults(defineProps<{ id?: string }>(), { id: randomId() });

const slots = useSlots();

const isColgroupColsSlotDefined = slots['colgroup-cols'] != null;
const isHeaderColsSlotDefined = slots['header-cols'] != null;
const isBodyRowsSlotDefined = slots['body-rows'] != null;
</script>
