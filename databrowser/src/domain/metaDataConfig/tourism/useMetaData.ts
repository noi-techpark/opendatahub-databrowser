// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, Ref } from 'vue';
import { useMetaDataForAllDatasets } from '../../../pages/datasets/overview/useDatasets';
import {
  DatasetPath,
  DatasetQuery,
  PathSegments,
} from '../../datasets/config/types';
import { TourismMetaData } from './types';

// Return the metadata for the route specified by the path params and query
export const useMetaDataForRoute = (
  datasetPath: Ref<DatasetPath | undefined>,
  datasetQuery: Ref<Pick<DatasetQuery, 'stringified'> | undefined>
) => {
  const { metaData } = useMetaDataForAllDatasets();

  const currentMetaData = computed(() => {
    return findMetaDataForPathAndQuery(
      metaData.value,
      datasetPath.value ?? [],
      datasetQuery.value?.stringified
    );
  });

  return { currentMetaData };
};

export const useMetaDataIdForRoute = (
  datasetPath: Ref<DatasetPath | undefined>,
  datasetQuery: Ref<DatasetQuery | undefined>
) => {
  const { currentMetaData } = useMetaDataForRoute(datasetPath, datasetQuery);

  const currentDatasetId = computed<string>(() => {
    if (currentMetaData.value != null) {
      return currentMetaData.value.id;
    }

    console.warn('Current metadata is not available');
    return datasetPath.value?.join('/') ?? 'default-dataset-path';
  });

  return currentDatasetId;
};

export const findMetaDataForPathAndQuery = (
  metaDataList: TourismMetaData[],
  path: string[],
  query: Record<string, string> | undefined
): TourismMetaData | undefined => {
  const candidates = metaDataList
    .filter((md) => {
      if (!pathsMatch(path, md.pathSegments)) {
        return false;
      }

      return filterContainedInQuery(md.apiFilter, query);
    })
    .sort(
      (a, b) =>
        Object.keys(b.apiFilter ?? {}).length -
        Object.keys(a.apiFilter ?? {}).length
    );

  return candidates.length > 0 ? candidates[0] : undefined;
};

const pathsMatch = (path1: PathSegments, path2: PathSegments) =>
  JSON.stringify(path1).localeCompare(JSON.stringify(path2)) === 0;

const filterContainedInQuery = (
  apiFilter: Record<string, string> | undefined,
  query: Record<string, string> | undefined
) => {
  if (apiFilter == null || query == null) {
    return false;
  }

  const apiFilterKeys = Object.keys(apiFilter);
  const queryKeys = Object.keys(query);

  // If there are more API filter keys than query keys, the filter cannot be contained in the query
  if (apiFilterKeys.length > queryKeys.length) {
    return false;
  }

  // Check if all API filter key / values are present in the query
  return Object.entries(apiFilter).every(
    ([key, value]) => query[key] === value
  );
};
