// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { onDeactivated, onUnmounted } from 'vue';
import { UserSettingsGuard, UserSettingsKeys } from './types';

interface UserSettingsGuardEntry {
  key: UserSettingsKeys | 'ALL';
  fn: UserSettingsGuard;
}

const userSettingsGuards: UserSettingsGuardEntry[] = [];

export const getUserSettingsGuards =
  (): ReadonlyArray<UserSettingsGuardEntry> => userSettingsGuards;

export const registerUserSettingsGuard = (
  key: UserSettingsGuardEntry['key'],
  fn: UserSettingsGuard
) => {
  const removeFromList = () => {
    userSettingsGuards.splice(userSettingsGuards.indexOf({ key, fn }), 1);
  };

  onUnmounted(removeFromList);
  onDeactivated(removeFromList);

  userSettingsGuards.push({ key, fn: fn });

  return removeFromList;
};
