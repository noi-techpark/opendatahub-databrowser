// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { spatialDataListView } from './spatialData.listView';
import { spatialDataSharedView } from './spatialData.sharedView';

export const spatialDataViews = {
  table: spatialDataListView,
  detail: spatialDataSharedView(),
  edit: spatialDataSharedView(),
  new: spatialDataSharedView(),
};
