// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  languageTableCell,
  lastChangesTableCell,
  pushDataTableCell,
  publishedOnTableCell,
  sourceTableCell,
} from '../../builder/tourism';

export const announcementListView: ListViewConfig = {
  elements: [
    {
      title: 'Title',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Detail.{language}.Title',
      },
    },
    {
      title: 'Description',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Detail.{language}.BaseText',
      },
    },
    {
      title: 'ID',
      component: CellComponent.StringCell,
      class: 'w-80',
      objectMapping: {
        text: 'Id',
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
      title: 'Coordinate',
      component: CellComponent.GpsPointsCell,
      class: 'w-60',
      objectMapping: {
        longitude: 'GpsInfo.Latitude',
        latitude: 'GpsInfo.Longitude',
      },
    },
    {
      title: 'Start Time',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      objectMapping: {
        date: 'StartTime',
      },
    },
    {
      title: 'End Time',
      component: CellComponent.EditedDateCell,
      class: 'w-48',
      objectMapping: {
        date: 'EndTime',
      },
    },
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
