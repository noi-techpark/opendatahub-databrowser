// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';

export const stationTypesLatestSharedView = ():
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
              title: 'sname',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.sname',
              },
            },
            {
              title: 'scode',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.scode',
              },
            },
            {
              title: 'stype',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.stype',
              },
            },
          ],
        },
        {
          name: 'Datastates',
          properties: [
            {
              title: 'mtransactiontime',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.mtransactiontime',
              },
            },
            {
              title: 'savailable',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.savailable',
              },
            },
            {
              title: 'sactive',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.sactive',
              },
            },
          ],
        },
        {
          name: 'Source and provenance',
          properties: [
            {
              title: 'sorigin',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.sorigin',
              },
            },
            {
              title: 'prname',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.prname',
              },
            },
            {
              title: 'prversion',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.prversion',
              },
            },
            {
              title: 'prlineage',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.prlineage',
              },
            },
          ],
        },
        {
          name: 'Metadata',
          properties: [
            {
              title: 'JSON',
              component: CellComponent.JsonCell,
              objectMapping: { data: 'data.0.smetadata' },
              params: { usePreformatted: 'true' },
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
                latitude: 'data.0.scoordinate.y',
                longitude: 'data.0.scoordinate.x',
              },
            },
            {
              title: 'srid',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.scoordinate.srid',
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
                latitude: 'data.0.scoordinate.y',
                longitude: 'data.0.scoordinate.x',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Measurements',
      slug: 'measurements',
      subcategories: [
        {
          name: 'Measurement',
          properties: [
            {
              title: 'Latest',
              component: CellComponent.MeasurementsCell,
              arrayMapping: {
                pathToParent: 'data',
                targetPropertyName: 'data',
                objectMapping: {
                  tdescription: 'tdescription',
                  tname: 'tname',
                  ttype: 'ttype',
                  tunit: 'tunit',
                  tmetadata: 'tmetadata',
                  mvalue: 'mvalue',
                  mvalidtime: 'mvalidtime',
                  mperiod: 'mperiod',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Parent station',
      slug: 'parent-station',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'pname',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.pname',
              },
            },
            {
              title: 'pcode',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.pcode',
              },
            },
            {
              title: 'ptype',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.ptype',
              },
            },
          ],
        },
        {
          name: 'Datastates',
          properties: [
            {
              title: 'pavailable',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.pavailable',
              },
            },
            {
              title: 'pactive',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.pactive',
              },
            },
          ],
        },
        {
          name: 'Source and provenance',
          properties: [
            {
              title: 'porigin',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.porigin',
              },
            },
          ],
        },
        {
          name: 'Metadata',
          properties: [
            {
              title: 'pmetadata',
              component: CellComponent.JsonCell,
              objectMapping: {
                data: 'data.0.pmetadata',
              },
              params: { usePreformatted: 'true' },
            },
          ],
        },
        {
          name: 'GPS Data',
          properties: [
            {
              title: '',
              component: CellComponent.GpsPointsCell,
              objectMapping: {
                latitude: 'data.0.pcoordinate.y',
                longitude: 'data.0.pcoordinate.x',
              },
            },
            {
              title: 'srid',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'data.0.pcoordinate.srid',
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
                latitude: 'data.0.pcoordinate.y',
                longitude: 'data.0.pcoordinate.x',
              },
            },
          ],
        },
      ],
    },
  ],
});
