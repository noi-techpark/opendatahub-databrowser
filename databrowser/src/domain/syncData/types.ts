// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface TourismSyncSource {
  key: string;
  name: Record<string, string>;
  syncDataApiUrl: string;
}
