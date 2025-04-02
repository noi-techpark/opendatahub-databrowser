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
  logoWithMainImageCells,
  odhTagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  webcamCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const skiRegionSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell(),
            {
              title: 'Ski region name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SkiRegionName.{language}' },
            },
            ...logoWithMainImageCells(),
          ],
        },
        {
          name: 'IDs',
          properties: [...idAndCustomIdCells()],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('skiregion'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    gpsDataCategory(),
    webcamCategory(),
    odhTagCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
