// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  languageTableCell,
  lastChangesTableCell,
  lastSyncTableCell,
  sourceTableCell,
} from '../../builder/tourism';
import { geoDataTableCell } from '../../builder/tourism/geoData';

export const spatialDataListView: ListViewConfig = {
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
      title: 'Shortname',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Shortname',
      },
    },
    {
      title: 'Title',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Detail.{language}.Title',
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
    geoDataTableCell(),
    languageTableCell(),
    lastChangesTableCell(),
    lastSyncTableCell(true, 'Id'),
    sourceTableCell(),
    {
      title: 'Source Active',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'Active',
      },
    },
  ],
};
