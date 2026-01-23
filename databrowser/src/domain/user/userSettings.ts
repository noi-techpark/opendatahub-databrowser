// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';
import { UserSettings, UserSettingsKeys } from './types';
import { getUserSettingsGuards } from './userSettingsGuard';

const initialSettings: UserSettings = {
  preferredDatasetSource: 'embedded',
  preferredDatasetLanguage: 'en',
  showEditHint: true,
  showHero: true,
  showToolbox: true,
  showMapViewNote: true,
  showSaveColumnConfigurationDialog: true,
  views: {
    tableView: {},
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

  const updateUserSetting = async <K extends UserSettingsKeys>(
    key: K,
    value: UserSettings[K],
    { skipGuards } = { skipGuards: false }
  ): Promise<boolean> => {
    if (!skipGuards) {
      // Check all registered guards before updating the setting
      for (const { key: guardKey, fn } of getUserSettingsGuards()) {
        if (guardKey !== 'ALL' && guardKey !== key) {
          continue;
        }

        const nextSettings = { ...userSettings.value, [key]: value };
        const canProceed = await fn(nextSettings, userSettings.value);
        if (!canProceed) {
          console.warn('User settings update blocked by guard');
          return false;
        }
      }
    }

    const nextSettings = { ...userSettings.value, [key]: value };
    userSettings.value = nextSettings;

    return true;
  };

  return {
    getUserSettings,
    getUserSetting,
    getUserSettingRef,
    updateUserSetting,
  };
};
