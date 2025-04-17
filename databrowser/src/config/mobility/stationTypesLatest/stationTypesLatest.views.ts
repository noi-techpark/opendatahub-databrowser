// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { stationTypesLatestListView } from './stationTypesLatest.listView';
import { stationTypesLatestSharedView } from './stationTypesLatest.sharedView';

export const stationTypesLatestViews = {
  table: stationTypesLatestListView,
  detail: stationTypesLatestSharedView(),
};
