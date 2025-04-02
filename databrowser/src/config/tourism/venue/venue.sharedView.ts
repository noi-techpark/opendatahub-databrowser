// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  contactCategory,
  textInfoCategory,
  gpsDataCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  logoWithMainImageCells,
  locationCategory,
  odhTagCategory,
  shortnameCell,
  dataStatesSubCategory,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const venueSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell(), ...logoWithMainImageCells()],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        {
          name: '',
          properties: [
            {
              title: 'Room Details',
              component: CellComponent.EditRoomVenueCell,
              arrayMapping: {
                pathToParent: 'RoomDetails',
                objectMapping: {
                  Shortname: 'Shortname',
                  Indoor: 'Indoor',
                  SquareMeters: 'SquareMeters',
                  Capacity: 'VenueSetup.0.Capacity',
                  SetupType: 'VenueSetup.0.VenueCode',
                },
                targetPropertyName: 'roomVenue',
              },
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('venue'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('venue'),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
