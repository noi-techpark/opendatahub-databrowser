// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useUserSettings } from '../../../user/userSettings';
import { DatasetUserSettings } from './types';

export const useDatasetUserSettings = (): DatasetUserSettings => {
  const { getUserSettingRef } = useUserSettings();

  const preferredDatasetSource = getUserSettingRef('preferredDatasetSource');

  const views = getUserSettingRef('views');

  return {
    preferredDatasetSource,
    views,
  };
};
