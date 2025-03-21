<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <LoadingError v-if="isError" :error="error" />
  <template v-else>
    <div class="overflow-y-auto md:flex">
      <ContentAlignmentX class="overflow-y-auto py-6 pb-20 md:flex">
        <div v-if="isLoading" class="w-full">
          <LoadingCell v-for="i in 10" :key="i" class="my-3" />
        </div>
        <VueJsonPretty
          v-else
          :data="data as any"
          :deep="3"
          show-length
          class="flex-1"
        />
      </ContentAlignmentX>
      <ExportDatasetsToolBox :url="fullPath" use-custom-button-labels />
    </div>
  </template>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import ExportDatasetsToolBox from '../toolBox/ExportDatasetsToolBox.vue';
import 'vue-json-pretty/lib/styles.css';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import ContentAlignmentX from '../../../../components/content/ContentAlignmentX.vue';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import LoadingCell from '../../../cellComponents/components/cells/loadingCell/LoadingCell.vue';

const VueJsonPretty = defineAsyncComponent(() =>
  import('vue-json-pretty').then((exports) => exports.default)
);

const { isError, isLoading, data, error, fullPath } = useSingleRecordLoad();
</script>

<style>
.vjs-tree-brackets:hover {
  @apply text-blue-500;
}

.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  @apply bg-gray-100;
}

.vjs-key {
  @apply pr-1.5;
}

.vjs-value-null {
  @apply text-red-500;
}

.vjs-value-boolean,
.vjs-value-number {
  @apply text-blue-500;
}

.vjs-value-string {
  @apply text-green-600;
}

.vjs-tree {
  @apply text-left;
}
</style>
