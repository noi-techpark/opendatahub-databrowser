// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { accommodationRoomsListView } from './accommodationRooms.listView';
import { accommodationRoomsSharedView } from './accommodationRooms.sharedView';

export const accommodationRoomsViews = {
  table: accommodationRoomsListView,
  detail: accommodationRoomsSharedView(),
  edit: accommodationRoomsSharedView(),
  new: accommodationRoomsSharedView(),
};
