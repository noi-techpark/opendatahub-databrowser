<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditGeoDataBase
    :title="title"
    :editable="editable"
    :is-editing="isEditing"
    @edit="emit('edit')"
    @expand="emit('expand')"
  >
    <div :class="{ 'p-4': !contentHasNoPadding }">
      <slot name="content"></slot>
    </div>
  </EditGeoDataBase>
</template>

<script setup lang="ts">
import EditGeoDataBase from './EditGeoDataBase.vue';

withDefaults(
  defineProps<{
    title?: string;
    contentHasNoPadding?: boolean;
    editable?: boolean;
    isEditing?: boolean;
  }>(),
  {
    title: '',
    contentHasNoPadding: false,
    editable: false,
    isEditing: false,
  }
);

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'expand'): void;
}>();
</script>
