// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useHead } from '@unhead/vue';
import { computed, Ref } from 'vue';
import { TourismMetaData } from '../../metaDataConfig/tourism/types';

export const useJsonLdHeadForDataset = (
  dataset: Ref<TourismMetaData | undefined>
) => {
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
            dateModified: dataset.value.lastUpdated, 
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
};
