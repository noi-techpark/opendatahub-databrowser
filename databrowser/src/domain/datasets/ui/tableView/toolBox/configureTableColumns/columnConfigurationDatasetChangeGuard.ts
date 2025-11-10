// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref } from 'vue';
import {
  NavigationGuard,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import { useMetaDataForAllDatasets } from '../../../../../../pages/datasets/overview/useDatasets';
import { findMetaDataForPathAndQuery } from '../../../../../metaDataConfig/tourism/useMetaData';
import { computeRoutePath } from '../../../../location/routePath';
import { stringifyRouteQuery } from '../../../../location/stringifyQuery';

export const useColumnConfigurationDatasetChangeGuard = (
  mode: Ref<'tableColumns' | 'columnSettings'>
) => {
  const { metaData } = useMetaDataForAllDatasets();

  const datasetChangeGuard: NavigationGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded
  ) => {
    // Find metadata for from and to route
    const toMetaData = findMetaDataForPathAndQuery(
      metaData.value,
      computeRoutePath(to),
      stringifyRouteQuery(to.query)
    );
    const fromMetaData = findMetaDataForPathAndQuery(
      metaData.value,
      computeRoutePath(from),
      stringifyRouteQuery(from.query)
    );

    // If we stay in the same dataset's table view, just navigate
    // Otherwise, switch back to tableColumns mode, showing the list of columns
    if (toMetaData?.id !== fromMetaData?.id) {
      mode.value = 'tableColumns';
    }
  };

  return {
    datasetChangeGuard,
  };
};
