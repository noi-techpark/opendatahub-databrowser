<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <AppLayout :show-app-footer="false">
    <div v-if="isError">
      <AlertError :title="'Error!'">{{ error?.message }}</AlertError>
    </div>

    <ContentDivider />

    <div class="relative flex flex-1 overflow-y-auto">
      <div class="flex flex-1 flex-col overflow-x-auto">
        <ContentAlignmentX>
          <DatasetHeader />
        </ContentAlignmentX>
        <template v-if="hasConfig">
          <slot></slot>
        </template>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onErrorCaptured } from 'vue';
import AlertError from '../../components/alert/AlertError.vue';
import ContentAlignmentX from '../../components/content/ContentAlignmentX.vue';
import ContentDivider from '../../components/content/ContentDivider.vue';
import { useDatasetBaseInfoStore } from '../../domain/datasets/config/store/datasetBaseInfoStore';
import DatasetHeader from '../../domain/datasets/ui/header/DatasetHeader.vue';
import AppLayout from '../../layouts/AppLayout.vue';

const { hasConfig, isError, error } = storeToRefs(useDatasetBaseInfoStore());

onErrorCaptured((hook) => {
  console.error('--------ERROR CAPTURED', hook);
  error.value = hook;
});
</script>
