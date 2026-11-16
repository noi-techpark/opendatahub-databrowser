// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, computed, toValue } from 'vue';
import { useApiRead } from '../../../../api/useApi';
import { DatasetDomain } from '../../../config/types';
import { useNormalizePath } from './normalizedPath';

// Mobility station details are loaded from the "/*/latest" endpoint to get
// the latest measurements. That endpoint returns no data at all for stations
// without measurements, so in that case the station data is loaded from the
// plain station endpoint instead (same query, without "/*/latest").
const mobilityLatestSuffix = /\/\*\/latest(?=\?|$)/;

const computeMobilityStationFallbackPath = (
  path: string | undefined,
  datasetDomain: DatasetDomain | undefined
) => {
  if (
    path == null ||
    datasetDomain !== 'mobility' ||
    !mobilityLatestSuffix.test(path)
  ) {
    return undefined;
  }
  return path.replace(mobilityLatestSuffix, '');
};

const hasEmptyMobilityData = (data: unknown) => {
  const records = (data as { data?: unknown } | undefined)?.data;
  return Array.isArray(records) && records.length === 0;
};

export const useSingleRecordLoadData = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  fullPath: MaybeRef<string | undefined>,
  isNewView: MaybeRef<boolean>
) => {
  const normalizedPath = useNormalizePath(fullPath, datasetDomain);

  // Don't fetch data if we are in a new view
  const enabled = computed(() => !toValue(isNewView));

  const { data, error, isError, isLoading, refetch } = useApiRead(
    normalizedPath,
    {
      withAuth: true,
      enabled,
      queryKey: [normalizedPath],
    }
  );

  const fallbackPath = computed(() =>
    computeMobilityStationFallbackPath(
      normalizedPath.value,
      toValue(datasetDomain)
    )
  );

  const fallbackEnabled = computed(
    () =>
      enabled.value &&
      fallbackPath.value != null &&
      hasEmptyMobilityData(data.value)
  );

  const {
    data: fallbackData,
    error: fallbackError,
    isError: isFallbackError,
    isLoading: isFallbackLoading,
    refetch: refetchFallback,
  } = useApiRead(fallbackPath, {
    withAuth: true,
    enabled: fallbackEnabled,
    queryKey: [fallbackPath],
  });

  const useFallback = computed(
    () => fallbackEnabled.value && fallbackData.value != null
  );

  const combinedData = computed(() =>
    useFallback.value ? fallbackData.value : data.value
  );

  const combinedError = computed(() =>
    fallbackEnabled.value && error.value == null
      ? fallbackError.value
      : error.value
  );

  const combinedIsError = computed(
    () => isError.value || (fallbackEnabled.value && isFallbackError.value)
  );

  const combinedIsLoading = computed(
    () => isLoading.value || (fallbackEnabled.value && isFallbackLoading.value)
  );

  const combinedRefetch = async () => {
    const result = await refetch();
    if (fallbackEnabled.value) {
      await refetchFallback();
    }
    return result;
  };

  return {
    data: combinedData,
    error: combinedError,
    isError: combinedIsError,
    isDataLoading: combinedIsLoading,
    refetch: combinedRefetch,
  };
};
