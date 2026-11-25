// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventOriginsSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Event name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evname' },
            },
            {
              title: 'Event category',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evcategory' },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [
            {
              title: 'Event UUID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evuuid' },
            },
            {
              title: 'Event series UUID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evseriesuuid' },
            },
          ],
        },
        {
          name: 'Source and provenance',
          properties: [
            {
              title: 'Event origin',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evorigin' },
            },
            {
              title: 'Parent name (prname)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.prname' },
            },
            {
              title: 'Parent version (prversion)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.prversion' },
            },
            {
              title: 'Parent lineage (prlineage)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.prlineage' },
            },
          ],
        },
        {
          name: 'Metadata',
          properties: [
            {
              title: 'JSON',
              component: CellComponent.JsonViewerCell,
              objectMapping: { data: 'data.0.evmetadata' },
            },
          ],
        },
      ],
    },
    {
      name: 'GPS Data',
      slug: 'gps-data',
      subcategories: [
        {
          name: 'GPS Data',
          properties: [
            {
              title: '',
              component: CellComponent.GpsPointsCell,
              objectMapping: {
                latitude: 'data.0.evlgeometry.coordinates.1',
                longitude: 'data.0.evlgeometry.coordinates.0',
              },
            },
          ],
        },
        {
          name: 'Map',
          properties: [
            {
              title: '',
              component: CellComponent.GpsPointMap,
              objectMapping: {
                latitude: 'data.0.evlgeometry.coordinates.1',
                longitude: 'data.0.evlgeometry.coordinates.0',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Event details',
      slug: 'event-details',
      subcategories: [
        {
          name: 'Description',
          properties: [
            {
              title: 'Description (DE)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evmetadata.placeDe' },
            },
            {
              title: 'Description (IT)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evmetadata.placeIt' },
            },
            {
              title: 'Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'data.0.evdescription' },
            },
          ],
        },
        {
          name: 'Event dates',
          properties: [
            {
              title: 'Event start',
              component: CellComponent.DateCell,
              objectMapping: { date: 'data.0.evstart' },
              params: { format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Event end',
              component: CellComponent.DateCell,
              objectMapping: { date: 'data.0.evend' },
              params: { format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Event transaction time',
              component: CellComponent.DateCell,
              objectMapping: { date: 'data.0.evtransactiontime' },
              params: { format: DEFAULT_DATE_TIME_FORMAT },
            },
          ],
        },
      ],
    },
  ],
});
