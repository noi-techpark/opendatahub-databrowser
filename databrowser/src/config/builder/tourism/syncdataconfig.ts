// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types.ts';
import {
  DetailElements,
  PropertyConfig,
} from '@/domain/datasets/config/types.ts';
import {DEFAULT_DATE_TIME_FORMAT} from "@/config/utils.ts";

export const syncdataconfigCell = (): PropertyConfig => ({
  title: '',
  component: CellComponent.SyncDataConfigCell,
  arrayMapping: {
    // targetPropertyName: 'syncdataconfigs',
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


export const lastSyncTableCell = (hasAction:boolean = true) : PropertyConfig => ({
  title: 'Last Sync',
  component: CellComponent.LastSyncCell,
  class: 'w-48',
  objectMapping: {
    id: 'Id',
    date: '_Meta.LastUpdate',
    text: 'AccoDetail.{language}.Name'
  },
  params: { 
    format: DEFAULT_DATE_TIME_FORMAT, 
    hasAction: (hasAction) ? "1" : "0"
  }
})
