// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import {DEFAULT_DATE_TIME_FORMAT} from "@/config/utils.ts";

export const pushconfigCell = (): PropertyConfig => ({
  title: 'asasd',
  component: CellComponent.PushConfigCell,
  arrayMapping: {
    targetPropertyName: 'pushconfigs',
    pathToParent: 'PushConfig',
    objectMapping: {
      baseurl: 'BaseUrl',
      pathparam: 'PathParam',
      pushapiurl: 'PushApiUrl',
    },
  },
});

export const pushconfigCategory = (): DetailElements => ({
  name: 'Pushconfig Details',
  slug: 'pushconfig-details',
  subcategories: [
    {
      name: '',
      properties: [pushconfigCell()],
    },
  ],
});

export const lastPushTableCell = (hasAction:boolean = true) : PropertyConfig => ({
  title: 'Last Push',
  component: CellComponent.LastPushCell,
  class: 'w-48',
  objectMapping: {
    id: '_Meta.Id',
    type: '_Meta.Type',
    publishedOn: 'PublishedOn',
    date: 'LastChange',
  },
  params: {
    format: DEFAULT_DATE_TIME_FORMAT,
    hasAction: (hasAction) ? "1" : "0"
  }
});
