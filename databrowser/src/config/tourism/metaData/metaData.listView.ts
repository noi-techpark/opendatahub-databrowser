// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import { imageTableCell, lastChangesTableCell } from '../../builder/tourism';

export const metaDataListView: ListViewConfig = {
  elements: [
    {
      title: 'Shortname',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'Shortname' },
    },
    imageTableCell(),
    {
      title: 'Description',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'ApiDescription.{language}' },
    },
    {
      title: 'Dataspace',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'Dataspace' },
    },
    {
      title: 'Category',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'Category' },
      params: { separator: ', ' },
    },
    {
      title: 'Data Provider',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'DataProvider' },
      params: { separator: ', ' },
    },
    {
      title: 'Count',
      component: CellComponent.StringCell,
      class: 'w-32',
      objectMapping: { text: 'RecordCount.Total' },
    },
    {
      title: 'Deprecated',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: { text: 'Deprecated' },
    },
    {
      title: 'Path',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'PathParam' },
      params: { separator: '/' },
    },
    {
      title: 'Filter',
      component: CellComponent.ArrayCell,
      class: 'w-60',
      objectMapping: { items: 'ApiFilter' },
      params: { separator: '&' },
    },
    {
      title: 'API URL',
      component: CellComponent.UrlCell,
      class: 'w-80',
      objectMapping: { text: 'ApiUrl' },
    },
    {
      title: 'Swagger URL',
      component: CellComponent.UrlCell,
      class: 'w-80',
      objectMapping: { text: 'SwaggerUrl' },
    },
    lastChangesTableCell(),
  ],
};
