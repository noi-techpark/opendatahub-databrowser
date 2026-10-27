// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  imageTableCell,
  titleTableCell,
  sourceTableCell,
  languageTableCell,
  lastChangesTableCell,
  publishedOnTableCell,
  pushDataTableCell,
  locationTableCellsAll,
  lastSyncTableCell,
} from '../../builder/tourism';

export const venueListView: ListViewConfig = {
  elements: [
    titleTableCell(),
    imageTableCell(),
    ...locationTableCellsAll({
      showRegion: false,
      showTourismAssociation: false,
      showMunicipality: true,
      showDistrict: true,
    }),
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
    lastSyncTableCell(true, 'Detail.{language}.Title'),
  ],
};
