// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { announcementListView } from './announcement.listView';
import { announcementSharedView } from './announcement.sharedView';

export const announcementViews = {
  table: announcementListView,
  detail: announcementSharedView(),
  edit: announcementSharedView(),
  new: announcementSharedView(),
};
