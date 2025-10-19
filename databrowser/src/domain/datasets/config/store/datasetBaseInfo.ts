// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, MaybeRef, ref, ToRefs, toValue, watch } from 'vue';
import {
  domainIsKnownToHaveOpenApiDocument,
  useOpenApi,
} from '../../../openApi';
import { useUserSettings } from '../../../user/userSettings';
import { useComputeDatasetLocation } from '../../location/datasetLocation';
import { extractView } from '../../view/modifiers/extractView/ViewKey';
import { computeViewWithOpenApiEnhancements } from '../../view/modifiers/openApiEnhancements/computeDeprecationAndRequiredAndReference';
import { useComputeViewKey } from '../../view/viewKey';
import { useDatasetConfigSourceComputations } from '../datasetConfigSource';
import { useResolveDatasetConfig } from '../load/datasetConfigResolver';
import { useObjectValueReplacer } from '../mapping/objectValueReplacer';
import { useStringReplacer } from '../mapping/stringReplacer';
import { useValueExtractor } from '../mapping/valueExtractor';
import { DatasetConfig, RouteLocation } from '../types';
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

  // Build params replacement facilities
  const stringifiedQuery = computed(() => toValue(datasetQuery)?.stringified);
  const stringReplacer = useStringReplacer(stringifiedQuery);
  const objectValueReplacer = useObjectValueReplacer(stringReplacer);
  const extractValueByPath = useValueExtractor(stringReplacer);

  // Compute source type
  const { isEmbeddedSource, isGeneratedSource, isUserSource } =
    useDatasetConfigSourceComputations(datasetConfigWithUserSettings);

  const baseViews = ref<DatasetConfig['views']>();
  watch(
    [datasetConfigWithUserSettings, datasetDomain, datasetPath, viewKey],
    ([_datasetConfig, _datasetDomain, _datasetPath, _viewKey]) => {
      baseViews.value = _datasetConfig?.views;

      // If any of the values needed for computation is undefined, do nothing
      if (
        _datasetConfig?.views == null ||
        _datasetDomain == null ||
        _datasetPath == null ||
        _viewKey == null
      ) {
        return;
      }

      if (_datasetConfig.views[_viewKey] == null) {
        console.warn(
          `View ${_viewKey} is not defined in dataset config, view is not enhanced with OpenAPI information.`
        );
        return;
      }

      // Check that domain is known to have an OpenAPI document
      if (!domainIsKnownToHaveOpenApiDocument(_datasetDomain)) {
        console.warn(
          `Domain ${_datasetDomain} is not known to have an OpenAPI document, view is not enhanced with OpenAPI information.`
        );
        return;
      }

      // Load OpenAPI document and then enhance view
      useOpenApi()
        .loadDocument(_datasetDomain)
        .then((doc) => {
          const view = extractView(_datasetConfig.views, _viewKey);
          if (view == null) {
            return;
          }

          const viewWithOpenApiEnhancements =
            computeViewWithOpenApiEnhancements(
              doc,
              _datasetDomain,
              _datasetPath,
              view
            );

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { type, defaultQueryParams, ...restView } =
            viewWithOpenApiEnhancements;

          baseViews.value = { ...baseViews.value, [_viewKey]: restView };
        });
    }
  );

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
