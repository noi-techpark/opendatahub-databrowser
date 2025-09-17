// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types.ts';
import { PropertyConfig } from '@/domain/datasets/config/types.ts';

export const pushDataTableCell = (): PropertyConfig => ({
  title: 'Push data',
  component: CellComponent.PushDataCell,
  class: 'w-40',
  objectMapping: {
    id: '_Meta.Id',
    type: '_Meta.Type',
    publishedOn: 'PublishedOn',
  },
});
