// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactiveComputed } from '@vueuse/core';
import { MaybeRef, ToRefs, toRefs, toValue } from 'vue';
import { DatasetConfig } from './types';

interface ComputeDatasetConfigSource {
  isEmbeddedSource: boolean;
  isGeneratedSource: boolean;
  isUserSource: boolean;
}

export const computeDatasetConfigSource = (
  datasetConfig?: DatasetConfig
): ComputeDatasetConfigSource => ({
  isEmbeddedSource: datasetConfig?.source === 'embedded',
  isGeneratedSource: datasetConfig?.source === 'generated',
  isUserSource: datasetConfig?.source === 'user',
});

export const useDatasetConfigSourceComputations = (
  datasetConfig: MaybeRef<DatasetConfig | undefined>
): ToRefs<ComputeDatasetConfigSource> => {
  const result = reactiveComputed(() =>
    computeDatasetConfigSource(toValue(datasetConfig))
  );

  return toRefs(result);
};
