// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Publisher } from '@/domain/cellComponents/components/cells/pushDataCell/types';
import { ListElements } from '../../config/types';

export type Column = ListElements & { firstPropertyPath: string | undefined };

export interface PushDialogPayload {
  id?: string;
  title?: string;
  publishers: Publisher[];
}

export interface SyncDialogPayload {
  id: string;
  title: string;
  type:string;
}


export interface RecordActionsData {
  _Meta?:{
    Id?: string;
    Type?: string;
    [key: string]: unknown;
  },
  PublishedOn?: string;
  [key: string]: unknown;
}
