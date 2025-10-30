// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useLocalStorage } from '@vueuse/core';
import { computed, onDeactivated, onUnmounted } from 'vue';
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

export interface GuardEntry {
  key: UserSettingsKeys | 'ALL';
  fn: (next: UserSettings, previous: UserSettings) => Promise<boolean>;
}

const changeGuards: GuardEntry[] = [];

const registerGuard = (key: GuardEntry['key'], fn: GuardEntry['fn']) => {
  const removeFromList = () => {
    changeGuards.splice(changeGuards.indexOf({ key, fn }), 1);
  };

  onUnmounted(removeFromList);
  onDeactivated(removeFromList);

  changeGuards.push({ key, fn: fn });

  return removeFromList;
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

  // const setUserSettings = async (settings: UserSettings): Promise<boolean> => {
  //   // Check all registered guards before updating the setting
  //   for (const { key, fn } of changeGuards) {
  //     if (key !== 'ALL') {
  //       continue;
  //     }
  //     const canProceed = await fn(settings, userSettings.value);
  //     if (!canProceed) {
  //       console.log('User settings update blocked by guard');
  //       return false;
  //     }
  //   }
  //   userSettings.value = settings;
  //   return true;
  // };

  const updateUserSetting = async <K extends UserSettingsKeys>(
    key: K,
    value: UserSettings[K],
    { skipGuards } = { skipGuards: false }
  ): Promise<boolean> => {
    // Check all registered guards before updating the setting
    if (!skipGuards) {
      for (const { key: guardKey, fn } of changeGuards) {
        if (guardKey !== 'ALL' && guardKey !== key) {
          continue;
        }
        const nextSettings = { ...getUserSettings(), [key]: value };
        const canProceed = await fn(nextSettings, userSettings.value);
        if (!canProceed) {
          console.log('User settings update blocked by guard');
          return false;
        }
      }
    }
    console.log(`-------Updating user setting "${key}" to:`, value);
    const nextSettings = { ...getUserSettings(), [key]: value };
    userSettings.value = nextSettings;
    console.log(
      `-------Updated user setting "${key}". New settings:`,
      JSON.parse(JSON.stringify(userSettings.value))
    );
    return true;
  };

  return {
    getUserSettings,
    getUserSetting,
    getUserSettingRef,
    // setUserSettings,
    updateUserSetting,
    registerGuard,
  };
};
