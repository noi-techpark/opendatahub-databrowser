// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';

export const venueroomdetailsCell = (): PropertyConfig => ({
  title: 'Venue Room',
  component: CellComponent.VenueRoomDetailsCell,
  arrayMapping: {
    targetPropertyName: 'items',
    pathToParent: 'VenueRoomDetailsIds',
  },
});

export const venueroomdetailsCategory = (): DetailElements => ({
  name: 'Venue Room Details',
  slug: 'venue-room-details',
  subcategories: [
    {
      name: '',
      properties: [venueroomdetailsCell()],
    },
  ],
});
