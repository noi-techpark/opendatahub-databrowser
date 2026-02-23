// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  languageTableCell,
  lastChangesTableCell,
  sourceTableCell,
} from '../../builder/tourism';
import { geoDataTableCell } from '../../builder/tourism/geoData';

export const tripListView: ListViewConfig = {
  elements: [
    {
      title: 'ID',
      component: CellComponent.StringCell,
      class: 'w-80',
      objectMapping: {
        text: 'Id',
      },
    },
    {
      title: 'Title',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Route.Detail.{language}.Title',
      },
    },
    {
      title: 'Tags',
      component: CellComponent.ArrayCell,
      class: 'w-48',
      objectMapping: {
        items: 'TagIds',
      },
      params: {
        separator: ', ',
      },
    },
    {
      title: 'Start Time',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      objectMapping: {
        date: 'Route.Calendar.OperationSchedule.Start',
      },
    },
    {
      title: 'End Time',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      objectMapping: {
        date: 'Route.Calendar.OperationSchedule.Stop',
      },
    },
    geoDataTableCell(),
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    {
      title: 'Source state',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'Active',
      },
    },
  ],
};
