// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref, computed, ref, watch } from 'vue';
import { providerForGeneratedDatasetConfig } from '../../../domain/datasets/config/load/loadGeneratedConfig';
import { DatasetConfig } from '../../../domain/datasets/config/types';
import { TourismMetaData } from '../../../domain/metaDataConfig/tourism/types';
import { useMetaDataQuery } from '../../../domain/metaDataConfig/tourism/useMetaDataQuery';
import { toError } from '../../../domain/utils/convertError';

/**
 * This method returns metadata for all datasets.
 *
 * If the metadata of a dataset is configured in the MetaData endpoint, that data will be returned.
 * Otherwise, a best-effort attempt will be made to generate metadata for the dataset from the
 * OpenAPI specification.
 */
export const useMetaDataForAllDatasets = () => {
  const {
    metaData: metaDataFromConfig,
    isLoading: isMetaDataFromConfigLoading,
    error: metaDataFromConfigError,
  } = useMetaDataFromConfig();

  const {
    metaData: metaDataFromOpenApi,
    isLoading: isMetaDataFromOpenApiLoading,
    error: metaDataFromOpenApiError,
  } = useMetaDataFromOpenApi(metaDataFromConfig);

  const metaData = computed(() => [
    ...metaDataFromConfig.value,
    ...metaDataFromOpenApi.value,
  ]);

  const isMetaDataLoading = computed(
    () =>
      isMetaDataFromConfigLoading.value || isMetaDataFromOpenApiLoading.value
  );

  const metaDataError = computed(() => {
    if (
      metaDataFromConfigError.value == null &&
      metaDataFromOpenApiError.value == null
    ) {
      return null;
    }

    const errors = [
      metaDataFromConfigError.value,
      metaDataFromOpenApiError.value,
    ];
    const errorMessage = errors
      .filter((e) => e != null)
      .map((e) => e.message)
      .join('; ');

    return new Error(errorMessage, { cause: errors });
  });

  return {
    metaDataFromConfig,
    isMetaDataFromConfigLoading,
    metaDataFromConfigError,
    metaDataFromOpenApi,
    isMetaDataFromOpenApiLoading,
    metaDataFromOpenApiError,
    metaData,
    isMetaDataLoading,
    metaDataError,
  };
};

/**
 * This method returns metadata for all datasets that are configured in the MetaData endpoint.
 */
export const useMetaDataFromConfig = () => {
  const metaData = ref<TourismMetaData[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const metaDataQuery = useMetaDataQuery();

  watch(
    [metaDataQuery.data, metaDataQuery.error],
    () => {
      metaData.value = metaDataQuery.data.value ?? [];
      error.value = metaDataQuery.error.value;
      isLoading.value = metaDataQuery.isLoading.value;
    },
    { immediate: true }
  );

  return { metaData, isLoading, error };
};

/**
 * This method builds metadata for datasets for the "tourism" domain (aka "content" API) from the OpenAPI specification.
 * No metadata for other domains (e.g. "mobility" domain, aka "timeseries" API) is built.
 *
 * Note, that only datasets with a path length greater than 1 and with a read-all endpoint are considered.
 *
 * @param excludedPaths A list of paths (given as string array) that should be excluded from the results.
 */
export const useMetaDataFromOpenApi = (
  excludedPaths: Ref<Pick<TourismMetaData, 'pathSegments'>[]>
) => {
  const metaData = ref<TourismMetaData[]>([]);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);

  const datasetConfigs = ref<DatasetConfig[]>([]);
  const isLoadingInternal = ref(true);

  // Load all datasets from OpenAPI specification
  providerForGeneratedDatasetConfig
    .loadAllDatasetConfigs()
    .then((loadedConfigs) => {
      // Get all configs for the "tourism" domain (aka "content" API)
      const tourismConfigs = loadedConfigs['tourism'] ?? [];

      // Filter out configs that can (or should) not be used
      datasetConfigs.value = tourismConfigs
        // Filter out configs with not pathSegments
        .filter((config) => config.route.pathSegments.length > 1)
        // Filter out configs without table view
        .filter((config) => config.views?.table != null);

      // Must set loading to false here and cannot use "finish" of this promise, because
      // the "datasetConfigs" watch function is executed before the promise the "finish"
      // method is invoked
      isLoadingInternal.value = false;
    })
    .catch((e: unknown) => {
      error.value = toError(e);
      isLoadingInternal.value = false;
    });

  watch(
    [datasetConfigs, excludedPaths],
    () => {
      // Use only configs that are not excluded by path matching
      const configs = datasetConfigs.value.filter((config) => {
        const pathSegments = config.route.pathSegments;
        const path = JSON.stringify(pathSegments);
        const pathMatch = excludedPaths.value.some((excludedPath) => {
          const excludePath = JSON.stringify(excludedPath.pathSegments);
          return path === excludePath;
        });
        // If the path is not excluded, the config is included
        return !pathMatch;
      });

      // Build metadata for each config
      metaData.value = configs
        .map<TourismMetaData>((config) => buildMetaData(config))
        .sort((a, b) => a.shortname.localeCompare(b.shortname));

      // Set loading state
      isLoading.value = isLoadingInternal.value;
    },
    { immediate: true }
  );

  return { metaData, isLoading, error };
};

const buildMetaData = (config: DatasetConfig): TourismMetaData => ({
  id: config.route.pathSegments.join('/'),
  baseUrl: config.baseUrl,
  access: 'unknown',
  description: config.description.description ?? 'No description available',
  shortname: config.description.title ?? '',
  output: 'json',
  swaggerUrl: 'https://api.tourism.testingmachine.eu/swagger/index.htm',
  externalLink: `${config.baseUrl}/${config.route.pathSegments.join('/')}`,
  pathSegments: config.route.pathSegments,
  sources: ['No information available'],
  apiFilter: {},
  recordCount: {},
  hasNoMetadata: true,
  tags: [],
  categories: [],
  dataProviders: [],
  datasetConfigurations: [],
  apiType: 'content',
});
