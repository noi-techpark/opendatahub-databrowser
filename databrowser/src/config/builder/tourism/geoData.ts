// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';

export const geoDataCategory = (): DetailElements => ({
  name: 'Geo Data',
  slug: 'geo-data',
  subcategories: [
    {
      name: 'Geo Data',
      properties: [
        {
          title: '',
          component: CellComponent.EditGeoDataCell,
          objectMapping: {
            geoData: 'Geo',
          },
        },
      ],
    },
  ],
});

export const geoDataTableCell = (): PropertyConfig => ({
  title: 'Geo Data',
  component: CellComponent.GeoDataCell,
  class: 'w-48',
  objectMapping: {
    geoData: 'Geo',
  },
});
