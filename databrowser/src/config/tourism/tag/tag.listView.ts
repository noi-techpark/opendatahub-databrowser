// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import { lastChangesTableCell, pushDataTableCell } from '../../builder/tourism';

export const tagListView: ListViewConfig = {
  elements: [
    {
      title: 'Id',
      component: CellComponent.StringCell,
      class: 'w-80',
      objectMapping: { text: 'Id' },
    },
    {
      title: 'Name',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'TagName.{language}' },
    },
    {
      title: 'Valid For',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'ValidForEntity' },
      params: { separator: ', ' },
    },
    {
      title: 'Tag Types',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'Types' },
      params: { separator: ', ' },
    },
    {
      title: 'Source',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'Source' },
    },
    lastChangesTableCell(),
    pushDataTableCell(),
  ],
};
