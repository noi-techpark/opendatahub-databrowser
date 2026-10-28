// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

export const gpsDataCategory = (): DetailElements => ({
  name: 'GPS',
  slug: 'gps-data',
  subcategories: [
    {
      name: 'GPS Points',
      properties: [
        {
          title: '',
          component: CellComponent.EditGpsInfoCell,
          arrayMapping: {
            targetPropertyName: 'gpsInfo',
            pathToParent: 'GpsInfo',
            objectMapping: {
              latitude: 'Latitude',
              longitude: 'Longitude',
              altitude: 'Altitude',
              unitMeasureAltitude: 'AltitudeUnitofMeasure',
              gpsType: 'Gpstype',
            },
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

export const gpsDataShortTableCell = (): PropertyConfig => ({
  title: 'GPS Data',
  component: CellComponent.GpsPointsCell,
  class: 'w-48',
  objectMapping: {
    latitude: 'GpsPoints.position.Latitude',
    longitude: 'GpsPoints.position.Longitude',
  },
});
