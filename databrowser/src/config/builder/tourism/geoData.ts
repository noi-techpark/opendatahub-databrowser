// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

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
          params: {
            positionValuesUrl: withOdhBaseUrl(
              '/v1/Distinct?odhtype=odhactivitypoi&fields=GpsPoints.[*].*.Gpstype&getasarray=true'
            ),
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

