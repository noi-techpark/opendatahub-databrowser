// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';

export const updatehistoryCategory = (): DetailElements => ({
  name: 'Update History',
  slug: 'updatehistory',
  subcategories: [
    {
      name: 'Last Update',
      properties: [
        updatehistoryRevisionCell(),
        updatehistoryLastUpdateCell(),
        updatehistoryUpdateSourceCell(),
        updatehistoryUpdatedByCell(),
      ],
    },
    {
      name: 'Last Updates grouped by UpdateId',
      properties: [updatehistoryHistoryCell()],
    },
  ],
});

export const updatehistoryRevisionCell = (): PropertyConfig => ({
  title: 'revision',
  component: CellComponent.StringCell,
  objectMapping: { text: '_Meta.UpdateInfo.Revision', readonly: 'true' },
});
export const updatehistoryLastUpdateCell = (): PropertyConfig => ({
  title: 'date',
  component: CellComponent.EditedDateCell,
  objectMapping: { date: '_Meta.LastUpdate', readonly: 'true' },
});
export const updatehistoryUpdateSourceCell = (): PropertyConfig => ({
  title: 'Source',
  component: CellComponent.StringCell,
  objectMapping: { text: '_Meta.UpdateInfo.UpdateSource', readonly: 'true' },
});
export const updatehistoryUpdatedByCell = (): PropertyConfig => ({
  title: 'Updated By',
  component: CellComponent.StringCell,
  objectMapping: { text: '_Meta.UpdateInfo.UpdatedBy', readonly: 'true' },
});
export const updatehistoryHistoryCell = (): PropertyConfig => ({
  title: 'Data was Updated by',
  component: CellComponent.UpdateHistoryCell,
  objectMapping: {
    items: '_Meta.UpdateInfo.UpdateHistory',
  },
});
