// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  idReadOnlyCell,
  lastChangesCell,
  licenseInfoCategory,
  pushconfigCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const publishedOnSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Key',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Key' },
              required: true,
            },
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Name.{language}' },
            },
            idReadOnlyCell(),
            {
              title: 'Publisher URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'Url' },
            },
            lastChangesCell(),
          ],
        },
      ],
    },
    pushconfigCategory(),
    licenseInfoCategory(),
    updatehistoryCategory(),
  ],
});
