// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetUserSettings } from '../datasets/config/store/types';
import { DatasetConfigSource } from '../datasets/config/types';

export interface UserSettings {
  preferredDatasetSource: DatasetConfigSource;
  preferredDatasetLanguage: string;
  showEditHint: boolean;
  showHero: boolean;
  showToolbox: boolean;
  showMapViewNote: boolean;
  views: DatasetUserSettings['views'];
}

export type UserSettingsKeys = keyof UserSettings;

export type UserSettingsGuard = (
  next: UserSettings,
  previous: UserSettings
) => Promise<boolean>;
