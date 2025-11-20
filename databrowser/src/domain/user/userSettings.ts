// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

type SettingKey =
  | 'preferredDatasetSource'
  | 'preferredDatasetLanguage'
  | 'showEditHint'
  | 'showHero'
  | 'showToolbox'
  | 'showMapViewNote';

type SettingValue = string | number | boolean | null | undefined;

const initialSettings: Record<SettingKey, SettingValue> = {
  preferredDatasetSource: 'embedded',
  preferredDatasetLanguage: 'en',
  showEditHint: true,
  showHero: true,
  showToolbox: true,
  showMapViewNote: true,
};

const userSettings = useLocalStorage<Record<SettingKey, SettingValue>>(
  'userSettings',
  initialSettings
);

// Initialize user settings with default values if not already set
userSettings.value = {
  ...initialSettings,
  ...userSettings.value,
};

export const useUserSettings = () => {
  // This hook can be used to manage user settings stored in local storage.
  const getUserSettings = () => {
    return userSettings.value;
  };

  const getUserSetting = <T = SettingValue>(key: SettingKey) => {
    return userSettings.value[key] as T;
  };

  const getUserSettingRef = <T = SettingValue>(key: SettingKey) => {
    return computed(() => userSettings.value[key] as T);
  };

  const setUserSettings = (settings: Record<SettingKey, SettingValue>) => {
    userSettings.value = settings || {};
  };

  const updateUserSetting = (key: SettingKey, value: SettingValue) => {
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
