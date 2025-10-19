// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref } from 'vue';
import { DatasetConfigSource, PropertyConfig } from '../types';

export interface DatasetUserSettingsTableViewCol {
  id: string;
  title: string;
  elements: PropertyConfig[];
}

export interface DatasetUserSettings {
  preferredSource: DatasetConfigSource;
  views: {
    tableView: {
      cols: Record<string, DatasetUserSettingsTableViewCol[]>;
    };
  };
}

export type DatasetUserSettingsRef = {
  [K in keyof DatasetUserSettings]: Ref<DatasetUserSettings[K]>;
};
