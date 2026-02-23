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
  tagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
  idReadOnlyCell,
} from '../../builder/tourism';
import { geoDataCategory } from '../../builder/tourism/geoData';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { additionalPropertiesCategory } from '../../builder/tourism/additionalProperties';

export const tripSharedView = ():
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
            shortnameCell(),
            {
              title: 'Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.BaseText' },
              class: 'break-all',
            },
            
          ],
        },
        {
          name: 'IDs',
          properties: [
            idReadOnlyCell(),
          ],
        },
        {
          name: 'Time',
          properties: [
            {
              title: 'Start Time',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'StartTime', readonly: 'true' },
              class: 'break-all',
            },
            {
              title: 'End Time',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'EndTime', readonly: 'true' },
              class: 'break-all',
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('trip'),
      ],
    },
    geoDataCategory(),
    tagCategory(''),
    additionalPropertiesCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
