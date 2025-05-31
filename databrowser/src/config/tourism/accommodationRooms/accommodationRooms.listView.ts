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
} from '../../builder/tourism';

export const accommodationRoomsListView: ListViewConfig = {
  elements: [
    {
      title: 'Name',
      component: CellComponent.StringCell,
      class: 'w-48',
      objectMapping: {
        text: 'AccoRoomDetail.{language}.Name',
      },
    },
    imageTableCell(),
    {
      title: 'Room Code',
      component: CellComponent.StringCell,
      class: 'w-24',
      objectMapping: {
        text: 'RoomCode',
      },
    },
    {
      title: 'Room Type',
      component: CellComponent.StringCell,
      class: 'w-32',
      objectMapping: {
        text: 'Roomtype',
      },
    },
    {
      title: 'Standard Occupancy',
      component: CellComponent.StringCell,
      class: 'w-32',
      objectMapping: {
        text: 'Roomstd',
      },
    },
    {
      title: 'Min Occupancy',
      component: CellComponent.StringCell,
      class: 'w-24',
      objectMapping: {
        text: 'Roommin',
      },
    },
    {
      title: 'Max Occupancy',
      component: CellComponent.StringCell,
      class: 'w-24',
      objectMapping: {
        text: 'Roommax',
      },
    },
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};