// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  dataStatesSubCategory,
  gpsDataCategory,
  idAndCustomIdCells,
  imageGalleryCategory,
  mainImageCell,
  odhTagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const metaRegionSharedView = (): DetailViewConfig | EditViewConfig => ({
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
              title: 'Tourismverein ID',
              component: CellComponent.ArrayCell,
              class: 'w-40',
              objectMapping: {
                items: 'TourismvereinIds',
              },
              params: {
                separator: ', ',
              },
            },
            {
              title: 'Region Ids',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'RegionIds',
              },
              params: {
                separator: ', ',
              },
            },
            {
              title: 'District Ids',
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
        sourceSubCategoryWithDistinct('metaregion'),
      ],
    },
    textInfoCategory(),
    imageGalleryCategory(),
    gpsDataCategory(),
    odhTagCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
