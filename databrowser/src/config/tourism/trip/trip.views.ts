// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { tripListView } from './trip.listView';
import { tripSharedView } from './trip.sharedView';

export const tripViews = {
  table: tripListView,
  detail: tripSharedView(),
  edit: tripSharedView(),
  new: tripSharedView(),
};
