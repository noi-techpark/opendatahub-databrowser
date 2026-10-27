// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  languageTableCell,
  lastChangesTableCell,
  publishedOnTableCell,
  sourceTableCell,
  titleTableCell,
  pushDataTableCell,
} from '../../builder/tourism';

export const districtListView: ListViewConfig = {
  elements: [
    titleTableCell(),
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    {
      title: 'Source Active',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'Active',
      },
    },
    {
      title: 'Visible in search',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'VisibleInSearch',
      },
    },
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
