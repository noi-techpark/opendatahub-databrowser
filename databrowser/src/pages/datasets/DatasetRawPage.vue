<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <SingleDatasetLayout>
    <JsonView />
  </SingleDatasetLayout>
</template>

<script setup lang="ts">
import JsonView from '../../domain/datasets/ui/rawView/JsonView.vue';
import SingleDatasetLayout from './SingleDatasetLayout.vue';
</script>
