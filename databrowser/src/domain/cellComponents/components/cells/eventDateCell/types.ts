// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface EventDateEntry {
  From?: string;
  To?: string;
  Begin?: string;
  End?: string;
  Entrance?: string;
  PriceFrom?: number;
  Active?: boolean;
  IsBookable?: boolean;
  SingleDays?: boolean;
  IsCancelled?: boolean;
  MinPersons?: number;
  MaxPersons?: number;
}
