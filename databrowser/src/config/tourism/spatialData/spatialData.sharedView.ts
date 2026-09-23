// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  tagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
  idReadOnlyCell,
  lastChangesCell,
} from '../../builder/tourism';
import { geoDataCategory } from '../../builder/tourism/geoData';
import { additionalPropertiesCategory } from '../../builder/tourism/additionalProperties';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const spatialDataSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell()],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        {
          name: 'Data states',
          properties: [
            {
              title: 'Active',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Active' },
            },
            lastChangesCell(),
            {
              title: 'First Import',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'FirstImport' },
              params: { format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Languages',
              component: CellComponent.ArrayCell,
              objectMapping: { items: 'HasLanguage' },
              params: { separator: ', ' },
            },
          ],
        },
        sourceSubCategoryWithDistinct('spatialdata'),
      ],
    },
    {
      name: 'Text information',
      slug: 'text-information',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Title',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.Title' },
            },
            {
              title: 'Base Text',
              component: CellComponent.HtmlCell,
              objectMapping: { html: 'Detail.{language}.BaseText' },
            },
          ],
        },
      ],
    },
    geoDataCategory(),
    tagCategory(''),
    additionalPropertiesCategory(),
    licenseInfoCategory(),
    mappingCategory(),
  ],
});
