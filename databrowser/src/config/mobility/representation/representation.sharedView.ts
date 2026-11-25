// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';

export const representationSharedView = ():
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
              title: 'JSON',
              component: CellComponent.JsonViewerCell,
              objectMapping: { data: 'data' },
            },
            {
              title: 'Details',
              component: CellComponent.EditRoomVenueCell,
              arrayMapping: {
                pathToParent: 'data',
                objectMapping: {
                  Shortname: 'sname',
                  Indoor: 'sactive',
                  SquareMeters: 'sorigin',
                  Capacity: 'stype',
                  SetupType: 'scode',
                },
                targetPropertyName: 'roomVenue',
              },
            },
          ],
        },
      ],
    },
  ],
});
