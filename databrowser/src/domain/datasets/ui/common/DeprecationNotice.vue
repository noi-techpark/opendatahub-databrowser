<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Notice shown for datasets that are deprecated and have a known replacement.
 
  Renders nothing unless getReplacement() returns an entry, which requires the
  dataset to be flagged `deprecated` AND to be listed in datasetReplacements.ts.
  Other deprecated datasets therefore get no notice.
 
-->
<template>
  <div
    v-if="replacement"
    role="note"
    class="rounded-sm border-l-4 border-[#ffc107] bg-[#fff3cd] px-3 py-2.5 text-sm text-[#664d03]"
  >
    {{ DEPRECATION_SENTENCE }} Use the new dataset:
    <a
      :href="replacement.url"
      target="_blank"
      rel="noopener"
      class="font-semibold underline"
      >{{ replacement.label }}</a
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { DEPRECATION_SENTENCE, getReplacement } from './datasetReplacements';

const props = defineProps<{ dataset: TourismMetaData }>();
const replacement = computed(() => getReplacement(props.dataset));
</script>
