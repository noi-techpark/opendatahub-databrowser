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
  idAndCustomIdCells,
  imageGalleryCategory,
  mainImageCell,
  odhTagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { withOdhBaseUrl } from '../../utils';

export const experienceAreaSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell(), mainImageCell()],
        },
        {
          name: 'IDs',
          properties: [
            ...idAndCustomIdCells(),
            {
              title: 'Tourism Associations IDs',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'TourismvereinIds',
              },
              params: {
                separator: ', ',
              },
            },
            {
              title: 'District IDs',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'DistrictIds',
              },
              params: {
                separator: ', ',
              },
            },
          ],
        },
        dataStatesSubCategory({ hasVisibleInSearch: true }),
        sourceSubCategoryWithDistinct('experiencearea'),
      ],
    },
    textInfoCategory(),
    imageGalleryCategory(),
    {
      name: 'Location',
      slug: 'location',
      subcategories: [
        {
          name: 'Locations',
          properties: [
            {
              title: 'Districts',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'tags',
                pathToParent: 'DistrictIds',
              },
              params: {
                keySelector: 'Id',
                labelSelector: 'Detail.en.Title',
                url: withOdhBaseUrl('/v1/District'),
              },
            },
          ],
        },
      ],
    },
    contactCategory(),
    gpsDataCategory(),
    odhTagCategory(),
    updatehistoryCategory(),
  ],
});
