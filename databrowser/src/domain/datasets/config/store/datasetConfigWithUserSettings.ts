// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as R from 'ramda';
import { computed, MaybeRef, toRef, toValue } from 'vue';
import { useMetaDataIdForRoute } from '../../../metaDataConfig/tourism/useMetaData';
import { DatasetConfig, DatasetPath, DatasetQuery, ViewKey } from '../types';
import { DatasetUserSettings } from './types';

export const useDatasetConfigWithUserSettings = (
  datasetConfig: MaybeRef<DatasetConfig | undefined>,
  viewKey: MaybeRef<ViewKey | undefined>,
  datasetPath: MaybeRef<DatasetPath | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>,
  datasetUserSettings: DatasetUserSettings
) => {
  const currentDatasetId = useMetaDataIdForRoute(
    toRef(datasetPath),
    toRef(datasetQuery)
  );

  const datasetConfigWithUserSettings = computed<DatasetConfig | undefined>(
    () => {
      const userSettingsValue = toValue(datasetUserSettings);
      const datasetConfigValue = toValue(datasetConfig);
      const viewKeyValue = toValue(viewKey);

      if (
        userSettingsValue.preferredDatasetSource.value !== 'user' ||
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
  userSettings: DatasetUserSettings
) => {
  // Get the table view configuration for the current dataset from user settings
  const tableViewForDatasetId = userSettings.views.value.tableView[datasetId];

  // If no user setting exists for this dataset, return the original dataset config
  if (tableViewForDatasetId == null) {
    return datasetConfig;
  }

  // Get the current active configuration based on the activeConfigId
  const currentTableViewConfigId = tableViewForDatasetId.activeConfigId;
  const currentTableViewConfig = tableViewForDatasetId.configs.find(
    (cfg) => cfg.id === currentTableViewConfigId
  );

  // If no active configuration is found, return the original dataset config
  if (currentTableViewConfig == null) {
    return datasetConfig;
  }

  // Enhance the dataset config with user-specific table view settings
  const enhancedDatasetConfig = R.assocPath(
    ['views', 'table', 'elements'],
    currentTableViewConfig.elements,
    datasetConfig
  );
  enhancedDatasetConfig.source = 'user';

  return enhancedDatasetConfig;
};
