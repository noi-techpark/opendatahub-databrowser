// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventOriginsListView: ListViewConfig = {
  elements: [
    {
      title: 'Event name',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: { text: 'evname' },
    },
    {
      title: 'Event category',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'evcategory' },
    },
    {
      title: 'Description (DE)',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'evmetadata.placeDe' },
      params: { textClasses: 'wrap-break-word' },
    },
    {
      title: 'Description (IT)',
      component: CellComponent.StringCell,
      class: 'w-60',
      objectMapping: { text: 'evmetadata.placeIt' },
      params: { textClasses: 'wrap-break-word' },
    },
    {
      title: 'Coordinate',
      component: CellComponent.GpsPointsCell,
      class: 'w-60',
      objectMapping: {
        longitude: 'evlgeometry.coordinates.0',
        latitude: 'evlgeometry.coordinates.1',
      },
    },
    {
      title: 'Event metadata',
      component: CellComponent.TypeBasedCell,
      class: 'w-80',
      objectMapping: { data: 'evmetadata' },
    },
    {
      title: 'Event start',
      component: CellComponent.DateCell,
      class: 'w-40',
      objectMapping: { date: 'evstart' },
      params: { format: DEFAULT_DATE_TIME_FORMAT },
    },
    {
      title: 'Event end',
      component: CellComponent.DateCell,
      class: 'w-40',
      objectMapping: { date: 'evend' },
      params: { format: DEFAULT_DATE_TIME_FORMAT },
    },
  ],
};
