<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TagReferenceCell
    :items="items"
    :url="urlWithSource"
    :key-selector="keySelector"
    :label-selector="labelSelector"
    :unique="unique"
    :editable="editable"
    :show-additional-data="showAdditionalData"
    :header-label="headerLabel"
    :hide-header="hideHeader"
    @update="$emit('update', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSourceOverride } from '../../utils/sourceOverride/useSourceOverride';
import TagReferenceCell from './TagReferenceCell.vue';

const props = defineProps<{
  items?: string[] | null;
  url?: string;
  keySelector?: string;
  labelSelector?: string;
  unique?: boolean | string;
  editable?: boolean;
  showAdditionalData?: boolean | string;
  headerLabel?: string;
  hideHeader?: boolean;
}>();

defineEmits<{
  update: [value: { prop: string; value: unknown }];
}>();

const { resolvedSource } = useSourceOverride();

const urlWithSource = computed(() => {
  if (props.url == null || resolvedSource.value == null) return props.url;
  const separator = props.url.includes('?') ? '&' : '?';
  return `${props.url}${separator}source=${encodeURIComponent(
    resolvedSource.value
  )}`;
});
</script>
