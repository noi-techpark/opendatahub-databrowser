// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  DatasetConfigSource,
  DatasetId,
  PropertyConfig,
} from '../datasets/config/types';

type ConfigId = string;

interface TableViewColumnConfig {
  id: ConfigId;
  name: string;
  elements: PropertyConfig[];
}

export interface UserSettingTableViewConfig {
  activeConfigId: ConfigId;
  configs: TableViewColumnConfig[];
}

export interface UserSettings {
  preferredDatasetSource: DatasetConfigSource;
  preferredDatasetLanguage: string;
  showEditHint: boolean;
  showHero: boolean;
  showToolbox: boolean;
  showMapViewNote: boolean;
  views: {
    tableView: Record<DatasetId, UserSettingTableViewConfig>;
  };
}

export type UserSettingsKeys = keyof UserSettings;

export type UserSettingsGuard = (
  next: UserSettings,
  previous: UserSettings
) => Promise<boolean>;
