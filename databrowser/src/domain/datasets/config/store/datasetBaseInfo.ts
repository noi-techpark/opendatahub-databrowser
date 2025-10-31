// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, MaybeRef, ToRefs, toValue } from 'vue';
import { useUserSettings } from '../../../user/userSettings';
import { useComputeDatasetLocation } from '../../location/datasetLocation';
import { useOpenApiEnhancements } from '../../view/modifiers/openApiEnhancements/openApiEnhancements';
import { useComputeViewKey } from '../../view/viewKey';
import { useDatasetConfigSourceComputations } from '../datasetConfigSource';
import { useResolveDatasetConfig } from '../load/datasetConfigResolver';
import { useObjectValueReplacer } from '../mapping/objectValueReplacer';
import { useStringReplacer } from '../mapping/stringReplacer';
import { useValueExtractor } from '../mapping/valueExtractor';
import { RouteLocation } from '../types';
import { useDatasetConfigWithUserSettings } from './datasetConfigWithUserSettings';
import { DatasetUserSettingsRef } from './types';

export const useDatasetBaseInfo = (
  routeLocation: MaybeRef<ToRefs<RouteLocation>>,
  userSettings: DatasetUserSettingsRef
) => {
  // Compute route location info
  const { routeName, routeDomain, routePath, routeId, routeQuery } =
    toValue(routeLocation);

  // Compute view key
  const viewKey = useComputeViewKey(routeName);

  // Resolve dataset config
  const { isResolving, isError, datasetConfig, error } =
    useResolveDatasetConfig(
      userSettings.preferredSource,
      routeDomain,
      routePath
    );

  // User preferred dataset language, which is stored in local storage
  // This allows the user to select a preferred language for datasets
  // and have it persist across sessions.

  const preferredLanguage = useUserSettings().getUserSettingRef(
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

  // Compute dataset config with user settings
  const datasetConfigWithUserSettings = useDatasetConfigWithUserSettings(
    datasetConfig,
    viewKey,
    datasetPath,
    datasetQuery,
    userSettings
  );

  // Compute base views, enhanced with OpenAPI information
  const { baseViews } = useOpenApiEnhancements(
    datasetConfigWithUserSettings,
    datasetDomain,
    datasetPath,
    viewKey
  );

  // Build params replacement facilities
  const stringifiedQuery = computed(() => toValue(datasetQuery)?.stringified);
  const stringReplacer = useStringReplacer(stringifiedQuery);
  const objectValueReplacer = useObjectValueReplacer(stringReplacer);
  const extractValueByPath = useValueExtractor(stringReplacer);

  // Compute source type
  const { isEmbeddedSource, isGeneratedSource, isUserSource } =
    useDatasetConfigSourceComputations(datasetConfigWithUserSettings);

  return {
    isLoading: isResolving,
    isError,
    error,
    source: computed(() => datasetConfigWithUserSettings.value?.source),
    datasetDomain,
    datasetPath,
    datasetQuery,
    datasetId,
    fullPath,
    viewKey,
    hasConfig: computed(() => datasetConfigWithUserSettings.value != null),
    baseViews,
    description: computed(
      () => datasetConfigWithUserSettings.value?.description
    ),
    operations: computed(() => datasetConfigWithUserSettings.value?.operations),
    stringReplacer,
    objectValueReplacer,
    extractValueByPath,
    isEmbeddedSource,
    isGeneratedSource,
    isUserSource,
  };
};
