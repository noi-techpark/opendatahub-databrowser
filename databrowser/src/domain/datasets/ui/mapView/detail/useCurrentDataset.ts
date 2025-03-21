// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, Ref } from 'vue';
import { useMetaDataForAllDatasets } from '../../../../../pages/datasets/overview/useDatasets';
import { TourismMetaData } from '../../../../metaDataConfig/tourism/types';

export const useCurrentDataset = (
  datasetId: Ref<string | undefined>
): {
  currentDataset: Ref<TourismMetaData | undefined>;
} => {
  const { metaData, isMetaDataLoading } = useMetaDataForAllDatasets();

  const currentDataset = computed(() => {
    if (isMetaDataLoading.value || datasetId.value == null) {
      return;
    }

    const dataset = metaData.value.find(
      (dataset) => dataset.id === datasetId.value
    );

    if (dataset == null) {
      console.error('No dataset found for feature', datasetId.value);
      return;
    }

    return dataset;
  });

  return { currentDataset };
};
