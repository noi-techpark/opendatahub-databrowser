// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { DetailElements } from '../../../domain/datasets/config/types';

export const gpsTrackCategory = (): DetailElements => ({
  name: 'GPS Track',
  slug: 'gps-track',
  subcategories: [
    {
      name: 'GPS Tracks',
      properties: [
        {
          title: '',
          component: CellComponent.EditGpsTrackCell,
          arrayMapping: {
            targetPropertyName: 'gpsTrack',
            pathToParent: 'GpsTrack',
            objectMapping: {
              Id: 'Id',
              Type: 'Type',
              Format: 'Format',
              GpxTrackUrl: 'GpxTrackUrl',
              GpxTrackDesc: 'GpxTrackDesc.{language}',
            },
          },
        },
      ],
    },
  ],
});
