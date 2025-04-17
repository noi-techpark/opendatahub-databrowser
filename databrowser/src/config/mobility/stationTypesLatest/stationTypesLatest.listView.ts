// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';

export const stationTypesLatestListView: ListViewConfig = {
  elements: [
    {
      title: 'Station name',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'sname' },
    },
    {
      title: 'Station code',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'scode' },
    },
    {
      title: 'Station coordinate',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'scoordinate' },
    },
    {
      title: 'Station metadata',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'smetadata' },
    },
    {
      title: 'Station type',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: { text: 'stype' },
    },
    {
      title: 'Station origin',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'sorigin' },
    },
    {
      title: 'Station available',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'savailable' },
    },
    {
      title: 'Station active',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'sactive' },
    },
    {
      title: 'Parent name',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'pname' },
    },
  ],
};
