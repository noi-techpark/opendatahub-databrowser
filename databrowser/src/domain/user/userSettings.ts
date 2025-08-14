// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { UserSettings } from './types';

const initialSettings: UserSettings = {
  preferredDatasetSource: 'embedded',
  preferredDatasetLanguage: 'en',
  showEditHint: true,
  showHero: true,
  showToolbox: true,
  showMapViewNote: true,
  views: {
    tableView: {
      cols: {},
    },
  },
};

const userSettings = useLocalStorage<UserSettings>(
  'userSettings',
  initialSettings
);

// Initialize user settings with default values if not already set
userSettings.value = {
  ...initialSettings,
  ...userSettings.value,
};

type UserSettingsKeys = keyof UserSettings;

export const useUserSettings = () => {
  // This hook can be used to manage user settings stored in local storage.
  const getUserSettings = (): UserSettings => {
    return userSettings.value;
  };

  const getUserSetting = <K extends UserSettingsKeys>(key: K) => {
    return userSettings.value[key];
  };

  const getUserSettingRef = <K extends UserSettingsKeys>(key: K) => {
    return computed(() => userSettings.value[key]);
  };

  const setUserSettings = (settings: UserSettings) => {
    userSettings.value = settings;
  };

  const updateUserSetting = <K extends UserSettingsKeys>(
    key: K,
    value: UserSettings[K]
  ) => {
    const settings = getUserSettings();
    settings[key] = value;
    setUserSettings(settings);
  };

  return {
    getUserSettings,
    getUserSetting,
    getUserSettingRef,
    setUserSettings,
    updateUserSetting,
  };
};
