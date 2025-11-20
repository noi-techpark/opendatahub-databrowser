// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, ToRefs, computed, ref, toValue } from 'vue';
import { useUserSettings } from '../../../user/userSettings';
import { useComputeDatasetLocation } from '../../location/datasetLocation';
import { useComputeViewKey } from '../../view/viewKey';
import { useDatasetConfigSourceComputations } from '../datasetConfigSource';
import { useResolveDatasetConfig } from '../load/datasetConfigResolver';
import { useObjectValueReplacer } from '../mapping/objectValueReplacer';
import { useStringReplacer } from '../mapping/stringReplacer';
import { useValueExtractor } from '../mapping/valueExtractor';
import { DatasetConfigSource, RouteLocation } from '../types';

export const useDatasetBaseInfo = (
  routeLocation: MaybeRef<ToRefs<RouteLocation>>,
  preferredSource: MaybeRef<DatasetConfigSource> = ref<DatasetConfigSource>(
    'any'
  )
) => {
  // Compute route location info
  const { routeName, routeDomain, routePath, routeId, routeQuery } =
    toValue(routeLocation);

  // Resolve dataset config
  const { isResolving, isError, datasetConfig, error } =
    useResolveDatasetConfig(preferredSource, routeDomain, routePath);

  // Compute view key
  const viewKey = useComputeViewKey(routeName);

  // User preferred dataset language, which is stored in local storage
  // This allows the user to select a preferred language for datasets
  // and have it persist across sessions.

  const preferredLanguage = useUserSettings().getUserSettingRef<string>(
    'preferredDatasetLanguage'
  );

  // Compute dataset location info
  const { datasetDomain, datasetPath, datasetQuery, datasetId, fullPath } =
    useComputeDatasetLocation({
      datasetConfig,
      viewKey,
      routeDomain,
      routePath,
      routeId,
      routeQuery,
      preferredLanguage,
    });

  // Build params replacement facilities
  const stringifiedQuery = computed(() => toValue(datasetQuery)?.stringified);
  const stringReplacer = useStringReplacer(stringifiedQuery);
  const objectValueReplacer = useObjectValueReplacer(stringReplacer);
  const extractValueByPath = useValueExtractor(stringReplacer);

  // Compute source type
  const { isEmbeddedSource, isGeneratedSource } =
    useDatasetConfigSourceComputations(datasetConfig);

  return {
    isLoading: isResolving,
    isError,
    error,
    source: computed(() => datasetConfig.value?.source),
    datasetDomain,
    datasetPath,
    datasetQuery,
    datasetId,
    fullPath,
    viewKey,
    hasConfig: computed(() => datasetConfig.value != null),
    baseViews: computed(() => datasetConfig.value?.views),
    description: computed(() => datasetConfig.value?.description),
    operations: computed(() => datasetConfig.value?.operations),
    stringReplacer,
    objectValueReplacer,
    extractValueByPath,
    isEmbeddedSource,
    isGeneratedSource,
  };
};
