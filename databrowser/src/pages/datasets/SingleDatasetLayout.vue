<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DatasetBaseLayout>
    <ContentDivider />
    <DatasetNavigation />
    <ContentDivider />
    <section
      :class="ignoreSectionStyling ? '' : `flex flex-1 flex-col overflow-y-auto`"
    >
      <slot></slot>
    </section>
  </DatasetBaseLayout>
</template>

<script setup lang="ts">
import ContentDivider from '../../components/content/ContentDivider.vue';
import DatasetNavigation from '../../domain/datasets/ui/header/DatasetNavigation.vue';
import DatasetBaseLayout from './DatasetBaseLayout.vue';

withDefaults(
  defineProps<{
    ignoreSectionStyling?: boolean;
  }>(),
  {
    ignoreSectionStyling: false,
  }
);
</script>
