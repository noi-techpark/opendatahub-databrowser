// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  gpsDataShortTableCell,
  imageTableCell,
  languageTableCell,
  lastChangesTableCell,
  locationTableCellsMinimal,
  publishedOnTableCell,
  pushDataTableCell,
  sourceTableCell,
  titleTableCell,
} from '../../builder/tourism';

export const odhActivityPoiListView: ListViewConfig = {
  elements: [
    titleTableCell(),
    imageTableCell(),
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
    // {
    //   title: 'Categories',
    //   component: CellComponent.ArrayCell,
    //   class: 'w-52',
    //   objectMapping: {
    //     items: 'AdditionalPoiInfos.{language}.Categories',
    //   },
    //   params: {
    //     separator: ', ',
    //   },
    // },
    ...locationTableCellsMinimal(),
    gpsDataShortTableCell(),
    {
      title: 'ODH Tags',
      component: CellComponent.ArrayCell,
      class: 'w-48',
      objectMapping: {
        items: 'SmgTags',
      },
      params: {
        separator: ', ',
      },
    },    
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
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
