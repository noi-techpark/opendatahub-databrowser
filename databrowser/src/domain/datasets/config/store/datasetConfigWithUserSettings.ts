// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as R from 'ramda';
import { computed, MaybeRef, toRef, toValue } from 'vue';
import { useMetaDataIdForRoute } from '../../../metaDataConfig/tourism/useMetaData';
import { DatasetConfig, DatasetPath, DatasetQuery, ViewKey } from '../types';
import { DatasetUserSettingsRef } from './types';

export const useDatasetConfigWithUserSettings = (
  datasetConfig: MaybeRef<DatasetConfig | undefined>,
  viewKey: MaybeRef<ViewKey | undefined>,
  datasetPath: MaybeRef<DatasetPath | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>,
  userSettings: DatasetUserSettingsRef
) => {
  const currentDatasetId = useMetaDataIdForRoute(
    toRef(datasetPath),
    toRef(datasetQuery)
  );

  const datasetConfigWithUserSettings = computed<DatasetConfig | undefined>(
    () => {
      const userSettingsValue = toValue(userSettings);
      const datasetConfigValue = toValue(datasetConfig);
      const viewKeyValue = toValue(viewKey);

      if (
        userSettingsValue.preferredSource.value !== 'user' ||
        datasetConfigValue == null ||
        viewKeyValue == null
      ) {
        return toValue(datasetConfig);
      }

      const view = datasetConfigValue?.views?.[viewKeyValue];

      if (view == null) {
        return toValue(datasetConfig);
      }

      if (viewKeyValue === 'table') {
        return handleTableViewCols(
          datasetConfigValue,
          currentDatasetId.value,
          userSettingsValue
        );
      }

      return datasetConfigValue;
    }
  );

  return datasetConfigWithUserSettings;
};

const handleTableViewCols = (
  datasetConfig: DatasetConfig,
  datasetId: string,
  userSettings: DatasetUserSettingsRef
) => {
  const userSettingsTableElements =
    userSettings.views.value.tableView.cols[datasetId]?.[0]?.elements;

  if (userSettingsTableElements == null) {
    return datasetConfig;
  }

  const enhancedDatasetConfig = R.assocPath(
    ['views', 'table', 'elements'],
    userSettingsTableElements,
    datasetConfig
  );
  enhancedDatasetConfig.source = 'user';

  return enhancedDatasetConfig;
};
