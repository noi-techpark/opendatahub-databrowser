// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';

export const syncdataconfigCell = (): PropertyConfig => ({
  title: '',
  component: CellComponent.SyncDataConfigCell,
  arrayMapping: {
    targetPropertyName: 'syncdataconfigs',
    pathToParent: 'SyncDataConfig',
    objectMapping: {
      baseurl: 'BaseUrl',
      pathparam: 'PathParam',
      syncdataapiurl: 'SyncDataApiUrl',
    },
  },
});

export const syncdataconfigCategory = (): DetailElements => ({
  name: 'SyncDataconfig Details',
  slug: 'syncdataconfig-details',
  subcategories: [
    {
      name: '',
      properties: [syncdataconfigCell()],
    },
  ],
});
