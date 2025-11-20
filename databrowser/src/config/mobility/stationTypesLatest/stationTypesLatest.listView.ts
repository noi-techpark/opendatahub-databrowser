// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';

export const stationTypesLatestListView: ListViewConfig = {
  elements: [
    {
      title: 'Station Name',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'sname' },
    },
    {
      title: 'Value',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'mvalue' },
    },
    {
      title: 'Unit',
      component: CellComponent.StringCell,
      class: 'w-20',
      objectMapping: { text: 'tunit' },
    },
    {
      title: 'Measurement',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'tname' },
    },
    {
      title: 'Valid Time',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'mvalidtime' },
    },
    {
      title: 'Timestamp',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: '_timestamp' },
    },
    {
      title: 'Station Code',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'scode' },
    },
    {
      title: 'Station Coordinate',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'scoordinate' },
    },
    {
      title: 'Station Metadata',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'smetadata' },
    },
    {
      title: 'Station Type',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: { text: 'stype' },
    },
    {
      title: 'Measurement Type',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: { text: 'ttype' },
    },
    {
      title: 'Measurement Description',
      component: CellComponent.StringCell,
      class: 'w-80',
      objectMapping: { text: 'tdescription' },
    },
    {
      title: 'Measurement Period',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'mperiod' },
    },
    {
      title: 'Station Available',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'savailable' },
    },
    {
      title: 'Station Active',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'sactive' },
    },
    {
      title: 'Process Name',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'prname' },
    },
    {
      title: 'Process Lineage',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'prlineage' },
    },
    {
        title: 'Station Origin',
        component: CellComponent.TypeBasedCell,
        class: 'w-40',
        objectMapping: { data: 'sorigin' },
    },
    {
        title: 'Transaction Time',
        component: CellComponent.TypeBasedCell,
        class: 'w-60',
        objectMapping: { data: 'mtransactiontime' },
    },
    {
      title: 'Measurement Metadata',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'tmetadata' },
    },
    {
      title: 'Process Version',
      component: CellComponent.StringCell,
      class: 'w-80',
      objectMapping: { text: 'prversion' },
    },
    {
      title: 'Parent Name',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'pname' },
    },
    {
      title: 'Parent Code',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'pcode' },
    },
    {
      title: 'Parent Type',
      component: CellComponent.TypeBasedCell,
      class: 'w-60',
      objectMapping: { data: 'ptype' },
    },
    {
      title: 'Parent Coordinate',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'pcoordinate' },
    },
    {
      title: 'Parent Metadata',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'pmetadata' },
    },
    {
      title: 'Parent Origin',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'porigin' },
    },
    {
      title: 'Parent Active',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'pactive' },
    },
    {
      title: 'Parent Available',
      component: CellComponent.TypeBasedCell,
      class: 'w-40',
      objectMapping: { data: 'pavailable' },
    },
  ],
};