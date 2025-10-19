// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useUserSettings } from '../../../user/userSettings';
import { DatasetUserSettingsRef } from './types';

export const useDatasetUserSettings = (): DatasetUserSettingsRef => {
  const { getUserSettingRef } = useUserSettings();

  const preferredSource = getUserSettingRef('preferredDatasetSource');

  const views = getUserSettingRef('views');

  // TODO: add other user settings

  return {
    preferredSource,
    views,
  };
};
