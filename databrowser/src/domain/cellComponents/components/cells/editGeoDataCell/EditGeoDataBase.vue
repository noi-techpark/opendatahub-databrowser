<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="rounded border">
    <div
      class="flex items-center justify-between bg-gray-50 px-4 py-2 font-semibold text-dialog"
    >
      {{ title }}
      <div class="flex items-center gap-4">
        <IconPencil
          v-if="editable"
          class="size-4 cursor-pointer text-green-400"
          :class="[
            isEditing
              ? 'size-5 rounded-[3px] border-[1.5px] border-green-400 bg-hint-calm-secondary p-[2px]'
              : '',
          ]"
          @click="emit('edit')"
        />
        <IconExpand
          class="size-4 cursor-pointer text-green-400"
          @click="emit('expand')"
        />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import IconExpand from '../../../../../components/svg/IconExpand.vue';
import IconPencil from '../../../../../components/svg/IconPencil.vue';

withDefaults(
  defineProps<{
    title?: string;
    editable?: boolean;
    isEditing?: boolean;
  }>(),
  {
    title: '',
    editable: false,
    isEditing: false,
  }
);

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'expand'): void;
}>();
</script>
