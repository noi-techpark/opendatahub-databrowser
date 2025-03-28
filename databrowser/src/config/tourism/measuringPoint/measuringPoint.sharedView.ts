// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  gpsDataCategory,
  idReadOnlyCell,
  shortnameCell,
  dataStatesSubCategory,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { DEFAULT_DATE_FORMAT } from '../../utils';

export const measuringPointSharedView = ():
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
            idReadOnlyCell(),
            shortnameCell(),
            {
              title: 'Owner ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OwnerId' },
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('measuringpoint'),
      ],
    },
    {
      name: 'Location',
      slug: 'location',
      subcategories: [
        {
          name: 'Location',
          properties: [
            {
              title: 'TV info',
              component: CellComponent.StringCell,
              objectMapping: { text: 'LocationInfo.TvInfo.Name.{language}' },
            },
            {
              title: 'Region info',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'LocationInfo.RegionInfo.Name.{language}',
              },
            },
          ],
        },
      ],
    },
    gpsDataCategory(),
    {
      name: 'Sensor data',
      slug: 'sensor-data',
      subcategories: [
        {
          name: 'Sensor data',
          properties: [
            {
              title: 'Snow height',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SnowHeight' },
            },
            {
              title: 'New snow height',
              component: CellComponent.StringCell,
              objectMapping: { text: 'newSnowHeight' },
            },
            {
              title: 'Temperature',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Temperature' },
            },
            {
              title: 'Last snow date',
              component: CellComponent.DateCell,
              objectMapping: { date: 'LastSnowDate' },
              params: { format: DEFAULT_DATE_FORMAT },
            },
          ],
        },
      ],
    },
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
