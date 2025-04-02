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
  odhTagCategory,
  regionIdCell,
  shortnameWithLogoAndMainImageSubCategory,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const tourismAssociationSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        shortnameWithLogoAndMainImageSubCategory(),
        {
          name: 'IDs',
          properties: [
            ...idAndCustomIdCells(),
            regionIdCell('RegionId'),
            {
              title: 'Ski Area Ids',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'SkiAreaIds',
              },
              params: {
                separator: ', ',
              },
            },
          ],
        },
        dataStatesSubCategory({ hasVisibleInSearch: true }),
        sourceSubCategoryWithDistinct('tourismassociation'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    gpsDataCategory(),
    odhTagCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
