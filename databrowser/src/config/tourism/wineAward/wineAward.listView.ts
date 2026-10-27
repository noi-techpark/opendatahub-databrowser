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
} from '../../builder/tourism';

export const wineAwardListView: ListViewConfig = {
  elements: [
    {
      title: 'Name/Title',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'Detail.{language}.Title',
      },
    },
    imageTableCell(),
    {
      title: 'Header',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: {
        text: 'Detail.{language}.Header',
      },
    },
    {
      title: 'Vintage',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: {
        text: 'Vintage',
      },
    },
    {
      title: 'Award Year',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: {
        text: 'Awardyear',
      },
    },
    {
      title: 'Awards',
      component: CellComponent.ArrayCell,
      class: 'w-40',
      objectMapping: {
        items: 'Awards',
      },
      params: {
        separator: ', ',
      },
    },
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
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
