// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { RecordId } from '../../../types';

export interface RecordValues {
  recordId: RecordId;
  data: unknown;
  values: Record<string, unknown>[];
}
