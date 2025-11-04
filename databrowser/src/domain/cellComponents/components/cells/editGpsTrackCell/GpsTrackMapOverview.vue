<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditGpsPointBase
    :title="title"
    :editable="false"
    @expand="emit('expand')"
  >
    <div :class="{ 'p-4': !contentHasNoPadding }">
      <slot name="content"></slot>
    </div>
  </EditGpsPointBase>
</template>

<script setup lang="ts">
import EditGpsPointBase from '../editGpsInfoCell/EditGpsPointBase.vue';

withDefaults(
  defineProps<{
    title?: string;
    contentHasNoPadding?: boolean;
  }>(),
  {
    title: '',
    contentHasNoPadding: false,
  }
);

const emit = defineEmits<{
  (e: 'expand'): void;
}>();
</script>
