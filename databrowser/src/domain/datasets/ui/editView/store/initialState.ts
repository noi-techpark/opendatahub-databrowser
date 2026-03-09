// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { EditStoreAction } from './types';

export type EditData = Record<string, unknown>;

export interface State {
  initial: EditData;
  current: EditData;
  action: EditStoreAction | null;
}

export const initialState: State = {
  initial: {},
  current: {},
  action: null,
};
