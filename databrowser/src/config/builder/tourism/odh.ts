// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';
import { idReadOnlyCell } from './id';

export const odhActiveTableCell = (): PropertyConfig => ({
  title: 'Open Data Hub state',
  component: CellComponent.StateCell,
  class: 'w-40',
  objectMapping: { state: 'OdhActive' },
});

export const odhTagCell = (mainentity?: string): PropertyConfig => {
  const filterParam = mainentity == null ? '' : `?validforentity=${mainentity}`;
  const url = withOdhBaseUrl('/v1/ODHTag') + filterParam;

  return {
    title: 'Open Data Hub Tags',
    component: CellComponent.TagReferenceCell,
    arrayMapping: {
      targetPropertyName: 'items',
      pathToParent: 'SmgTags',
    },
    params: { url, keySelector: 'Id', labelSelector: 'TagName.{language}' },
  };
};

export const odhTagCategory = (mainentity?: string): DetailElements => {
  return {
    name: 'ODH Tags',
    slug: 'ODH Tags',
    subcategories: [
      {
        name: '',
        properties: [odhTagCell(mainentity)],
      },
    ],
  };
};

export const odhTypeDetailElement = (): DetailElements => ({
  name: 'Main data',
  slug: 'main-data',
  subcategories: [
    {
      name: '',
      properties: [
        idReadOnlyCell(),
        {
          title: 'Key',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Key' },
        },
        {
          title: 'Type',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Type' },
        },
        {
          title: 'TypeDesc',
          component: CellComponent.StringCell,
          objectMapping: { text: 'TypeDesc.{language}' },
        },
        {
          title: 'Bitmask',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Bitmask' },
        },
        {
          title: 'Parent',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Parent' },
        },
      ],
    },
  ],
});
