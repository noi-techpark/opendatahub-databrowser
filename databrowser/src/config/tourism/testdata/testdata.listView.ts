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

export const testdataListView: ListViewConfig = {
  elements: [
    {
      title: 'ID',
      component: CellComponent.StringCell,
      class: 'w-48',
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
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    {
      title: 'Active',
      component: CellComponent.StateCell,
      class: 'w-40',
      objectMapping: {
        state: 'Active',
      },
    },
  ],
};
