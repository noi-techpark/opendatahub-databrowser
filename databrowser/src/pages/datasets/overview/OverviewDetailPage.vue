<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <AppLayout>
    <template v-if="dataset">
      <OverviewDetailHero :dataset="dataset" />

      <PageGridContent>
        <OverviewCardDescription :dataset="dataset" />
        <OverviewCardAccess :dataset="dataset" />
        <OverviewCardTabs :dataset="dataset" />
        <OverviewToListLink class="justify-self-start" />
        <OverviewCardSuggestion :datasets="randomDatasets" />

        <CardDivider />

        <PartnersAndContributors />
      </PageGridContent>
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import OverviewCardTabs from './OverviewCardTabs.vue';
import OverviewCardDescription from './OverviewCardDescription.vue';
import OverviewCardAccess from './OverviewCardAccess.vue';
import { getRandomElementsFromArray } from '@/components/utils/array';
import OverviewDetailHero from './OverviewDetailHero.vue';
import PartnersAndContributors from '@/components/partners/PartnersAndContributors.vue';
import CardDivider from '@/components/card/CardDivider.vue';
import PageGridContent from '@/components/content/PageGridContent.vue';
import OverviewCardSuggestion from './OverviewCardSuggestion.vue';
import { useMetaDataQuery } from '@/domain/metaDataConfig/tourism/useMetaDataQuery.ts';
import { TourismMetaData } from '@/domain/metaDataConfig/tourism/types.ts';
import OverviewToListLink from './OverviewToListLink.vue';
import { useHead } from '@unhead/vue';

const route = useRoute();

const metaData = useMetaDataQuery();

const dataset = computed<TourismMetaData | undefined>(() => {
  return (metaData.data?.value ?? []).find(
    (dataset) => dataset.id === route.params.id
  );
});

const randomDatasets = ref<TourismMetaData[]>([]);

//Head injection: Created a JSON-LD script
useHead({
  script: computed(() => {
    if (!dataset.value) return [];
    return [
      {
        type: 'application/ld+json',
        textContent: JSON.stringify({
          '@context': 'https://schema.org/',
          '@type': 'Dataset',
          name: dataset.value.shortname,
          description: dataset.value.description,
          url: window.location.href,
          creator: {
            '@type': 'Organization',
            name: 'Open Data Hub',
            url: 'https://opendatahub.com/',
          },
          license: dataset.value.licenseInfo?.license,
        }),
      },
    ];
  }),
});

watch(
  () => dataset.value,
  () => {
    // Get 3 random datasets, sorted by title.
    // Note that the current dataset will never be in
    // in the result list, because it is filtered out
    randomDatasets.value = getRandomElementsFromArray(
      (metaData.data?.value ?? []).filter(
        (dataset) => dataset.id !== route.params.id
      ),
      3
    ).sort((a, b) => a.shortname?.localeCompare(b.shortname));
  },

  { immediate: true }
);
</script>
