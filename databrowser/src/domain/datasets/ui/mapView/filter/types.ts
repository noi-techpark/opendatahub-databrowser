// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface SelectDatasetItem {
  id: string;
  name: string;
  fetching: boolean;
  fetched: boolean;
  error: string | null;
  count: number;
  color: string;
  selected: boolean;
  children: SelectDatasetItem[];
}
