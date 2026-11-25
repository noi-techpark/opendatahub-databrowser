// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  imageTableCell,
  languageTableCell,
  lastChangesTableCell,
  pushDataTableCell,
  publishedOnTableCell,
  sourceTableCell,
  lastPushTableCell,
  lastSyncTableCell,
  locationTableCellsAll,
} from '../../builder/tourism';

export const accommodationListView: ListViewConfig = {
  elements: [
    {
      title: 'Title',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'AccoDetail.{language}.Name',
      },
    },
    imageTableCell(),
    {
      title: 'Accommodation Type',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'AccoTypeId',
      },
    },
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
    ...locationTableCellsAll({
      showRegion: false,
      showTourismAssociation: false,
      showMunicipality: true,
      showDistrict: false,
    }),    
    lastPushTableCell(true),
    lastSyncTableCell(true),
    {
      title: 'Themes',
      component: CellComponent.ArrayCell,
      class: 'w-48',
      objectMapping: {
        items: 'ThemeIds',
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
