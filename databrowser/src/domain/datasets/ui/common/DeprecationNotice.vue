<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Notice shown for every dataset flagged `deprecated`.

  The yellow notice is always shown. The link to the new dataset is optional
  and only appears when getReplacement() finds an entry for the dataset, so
  deprecated datasets without a replacement get the same notice with no link.
-->
<template>
  <div
    v-if="dataset.deprecated"
    role="note"
    class="rounded border-l-4 border-[#ffc107] bg-[#fff3cd] px-3 py-2.5 text-sm text-[#664d03]"
  >
    {{ DEPRECATION_SENTENCE }}
    <template v-if="replacement">
      Use the new dataset:
      <a
        :href="replacement.url"
        target="_blank"
        rel="noopener"
        class="font-semibold underline"
        >{{ replacement.label }}</a
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TourismMetaData } from '../../../metaDataConfig/tourism/types';
import { DEPRECATION_SENTENCE, getReplacement } from './datasetReplacements';

const props = defineProps<{ dataset: TourismMetaData }>();
const replacement = computed(() => getReplacement(props.dataset));
</script>