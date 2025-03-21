<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditGpsPointBase
    :title="title"
    :editable="editable"
    :is-editing="isEditing"
    @edit="emit('edit')"
    @expand="emit('expand')"
  >
    <div :class="{ 'p-4': !contentHasNoPadding }">
      <slot name="content"></slot>
    </div>
  </EditGpsPointBase>
</template>

<script setup lang="ts">
import EditGpsPointBase from './EditGpsPointBase.vue';

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
