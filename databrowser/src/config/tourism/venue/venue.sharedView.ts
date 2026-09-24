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
  tagCategory,
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
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('venue'),
      ],
    },
    {
      name: 'Room Management',
      slug: 'room-management',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: 'Room Details',
              component: CellComponent.EditRoomVenueCell,
              arrayMapping: {
                pathToParent: 'RoomDetails',
                objectMapping: {
                  Id: 'Id',                  
                  Shortname: 'Shortname',
                  Detail: 'Detail',                  
                  MaxCapacity: 'MaxCapacity',
                  Placement: 'Placement',
                  Active: 'Active',
                  TagIds: 'TagIds',
                  VenueRoomProperties: 'VenueRoomProperties',
                  Mapping: 'Mapping',
                },
                targetPropertyName: 'roomVenue',
              },
            },
          ],
        },
      ],
    },    
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    locationCategory(),
    gpsDataCategory(),
    tagCategory('venue'),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
