// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref } from 'vue';
import { UserSettings } from '../../../user/types';

export interface DatasetUserSettings {
  preferredDatasetSource: Ref<UserSettings['preferredDatasetSource']>;
  views: Ref<UserSettings['views']>;
}
