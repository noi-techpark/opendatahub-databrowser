// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface PropertyValue {
  prop: string;
  value: unknown;
}

export type EditStoreAction = 'new' | 'duplicate';

export type PropertyUpdate = PropertyValue | PropertyValue[];
