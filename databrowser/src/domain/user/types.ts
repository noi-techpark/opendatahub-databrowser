// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfigSource, PropertyConfig } from '../datasets/config/types';

interface TableViewCol {
  id: string;
  title: string;
  elements: PropertyConfig[];
}

export interface UserSettings {
  preferredDatasetSource: DatasetConfigSource;
  preferredDatasetLanguage: string;
  showEditHint: boolean;
  showHero: boolean;
  showToolbox: boolean;
  showMapViewNote: boolean;
  views: {
    tableView: {
      cols: Record<string, TableViewCol[]>;
    };
  };
}

export type UserSettingsKeys = keyof UserSettings;

export type UserSettingsGuard = (
  next: UserSettings,
  previous: UserSettings
) => Promise<boolean>;
