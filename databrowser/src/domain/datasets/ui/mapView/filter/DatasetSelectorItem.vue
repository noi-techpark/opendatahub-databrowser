<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-start gap-2">
    <CheckboxCustom
      :model-value="item.selected"
      class="mt-px"
      @update:model-value="emit('toggleDataset', item.id)"
    />
    <div class="break-all">{{ item.name }}</div>
    <div
      v-if="item.selected"
      :style="{ backgroundColor: item.color }"
      class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
    >
      {{ item.name.at(0) }}
    </div>

    <ErrorPopover v-if="item.error" class="mt-1">
      {{ item.error }}
    </ErrorPopover>

    <IconCycle
      v-if="item.fetching"
      class="animate-spin text-dialog"
      :class="[{ hidden: !item.fetching }]"
    />
    <template v-else-if="item.fetched"> ({{ item.count }})</template>
  </div>
</template>

<script setup lang="ts">
import CheckboxCustom from '../../../../../components/checkbox/CheckboxCustom.vue';
import IconCycle from '../../../../../components/svg/IconCycle.vue';
import ErrorPopover from './ErrorPopover.vue';
import { SelectDatasetItem } from './types';

const emit = defineEmits<{
  (e: 'toggleDataset', datasetId: string): void;
}>();

defineProps<{ item: SelectDatasetItem }>();
</script>
