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
  dataStatesSubCategory,
  gpsDataCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  locationCategory,
  logoWithMainImageCells,
  odhTagCategory,
  seasonCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const gastronomySharedView = (): EditViewConfig | DetailViewConfig => ({
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
          name: 'Gastronomy details',
          properties: [
            {
              title: 'Max Seating Capacity',
              component: CellComponent.StringCell,
              objectMapping: { text: 'MaxSeatingCapacity' },
            },
            {
              title: 'Category',
              component: CellComponent.ArrayTagsCell,
              objectMapping: {
                items: 'CategoryCodes',
              },
              params: {
                propertyName: 'Shortname',
                separator: ', ',
                max: '3',
              },
            },
            {
              title: 'Facilities',
              component: CellComponent.ArrayTagsCell,
              objectMapping: {
                items: 'Facilities',
              },
              params: {
                propertyName: 'Shortname',
                separator: ', ',
                max: '3',
              },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [
            idReadOnlyCell(),
            {
              title: 'Area ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'LocationInfo.AreaInfo.Id' },
              class: 'break-all',
            },
            {
              title: 'Accommodation ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccommodationId' },
              class: 'break-all',
            },
            {
              title: 'Marketing group ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'MarketinggroupId' },
              class: 'break-all',
            },
          ],
        },
        dataStatesSubCategory({ hasVisibleInSearch: true }),
        sourceSubCategoryWithDistinct('gastronomy'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    locationCategory(),
    seasonCategory(),
    gpsDataCategory(),
    odhTagCategory('gastronomy'),
    updatehistoryCategory(),
  ],
});
