// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref, ref, watch } from 'vue';
import {
  domainIsKnownToHaveOpenApiDocument,
  useOpenApi,
} from '../../../../openApi';
import {
  DatasetConfig,
  DatasetDomain,
  DatasetPath,
  ViewKey,
} from '../../../config/types';
import { extractView } from '../extractView/ViewKey';
import { computeViewWithOpenApiEnhancements } from './computeDeprecationAndRequiredAndReference';

export const useOpenApiEnhancements = (
  datasetConfig: Ref<DatasetConfig | undefined>,
  datasetDomain: Ref<DatasetDomain | undefined>,
  datasetPath: Ref<DatasetPath | undefined>,
  viewKey: Ref<ViewKey | undefined>
) => {
  const baseViews = ref<DatasetConfig['views']>();
  watch(
    [datasetConfig, datasetDomain, datasetPath, viewKey],
    ([
      datasetConfigValue,
      datasetDomainValue,
      datasetPathValue,
      viewKeyValue,
    ]) => {
      baseViews.value = datasetConfigValue?.views;

      // If any of the values needed for computation is undefined, do nothing
      if (
        datasetConfigValue?.views == null ||
        datasetDomainValue == null ||
        datasetPathValue == null ||
        viewKeyValue == null
      ) {
        return;
      }

      if (datasetConfigValue.views[viewKeyValue] == null) {
        return;
      }

      // Check that domain is known to have an OpenAPI document
      if (!domainIsKnownToHaveOpenApiDocument(datasetDomainValue)) {
        console.warn(
          `Domain ${datasetDomainValue} is not known to have an OpenAPI document, view is not enhanced with OpenAPI information.`
        );
        return;
      }

      // Load OpenAPI document and then enhance view
      useOpenApi()
        .loadDocument(datasetDomainValue)
        .then((doc) => {
          const view = extractView(datasetConfigValue.views, viewKeyValue);
          if (view == null) {
            return;
          }

          const viewWithOpenApiEnhancements =
            computeViewWithOpenApiEnhancements(
              doc,
              datasetDomainValue,
              datasetPathValue,
              view
            );

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { type, defaultQueryParams, ...restView } =
            viewWithOpenApiEnhancements;

          baseViews.value = { ...baseViews.value, [viewKeyValue]: restView };
        });
    }
  );

  return { baseViews };
};
