<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ArrayLookupCell
    :lookup-url="lookupUrlWithSource"
    :key-selector="keySelector"
    :label-selector="labelSelector"
    :items="items"
    :unique="unique"
    :add-label="addLabel"
    :show-url="showUrl"
    :no-options-available-label="noOptionsAvailableLabel"
    :enabled="resolvedSource != null"
    :disabled-label="disabledLabel"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSourceOverride } from '../../utils/sourceOverride/useSourceOverride';
import ArrayLookupCell from './ArrayLookupCell.vue';

const props = defineProps<{
  lookupUrl?: string;
  keySelector?: string;
  labelSelector?: string;
  items?: string[] | null;
  unique?: boolean | string;
  addLabel?: string;
  showUrl?: boolean | string;
  noOptionsAvailableLabel?: string;
  disabledLabel?: string;
}>();

const { resolvedSource } = useSourceOverride();

const lookupUrlWithSource = computed(() => {
  if (props.lookupUrl == null || resolvedSource.value == null)
    return props.lookupUrl;
  const separator = props.lookupUrl.includes('?') ? '&' : '?';
  return `${props.lookupUrl}${separator}source=${encodeURIComponent(
    resolvedSource.value
  )}`;
});
</script>
