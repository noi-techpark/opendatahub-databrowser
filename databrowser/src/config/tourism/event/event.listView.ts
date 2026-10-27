// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  imageTableCell,
  languageTableCell,
  lastChangesTableCell,
  publishedOnTableCell,
  pushDataTableCell,
  sourceTableCell,
  titleTableCell,
  locationTableCellsMerged,
  lastSyncTableCell,
} from '../../builder/tourism';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventListView: ListViewConfig = {
  elements: [
    titleTableCell(),
    imageTableCell(),
    {
      title: 'Date start',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      params: { format: DEFAULT_DATE_TIME_FORMAT },
      objectMapping: { date: 'DateBegin' },
    },
    {
      title: 'Date end',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      params: { format: DEFAULT_DATE_TIME_FORMAT },
      objectMapping: { date: 'DateEnd' },
    },
    ...locationTableCellsMerged(),
    {
      title: 'Tags',
      component: CellComponent.ArrayTagsCell,
      class: 'w-48',
      objectMapping: {
        items: 'Tags',
      },
      params: {
        propertyName: 'Name',
        separator: ', ',
        max: '5',
      },
    },
    languageTableCell(),
    lastChangesTableCell(),
    lastSyncTableCell(true, 'Detail.{language}.Title'),
    sourceTableCell(),
    {
      title: 'Source Active',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'Active',
      },
    },
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
