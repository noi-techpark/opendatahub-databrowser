// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { testdataListView } from './testdata.listView';
import { testdataSharedView } from './testdata.sharedView';

export const testdataViews = {
  table: testdataListView,
  detail: testdataSharedView(),
  edit: testdataSharedView(),
  new: testdataSharedView(),
};
