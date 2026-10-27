// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  PropertyConfig,
  SubCategoryElement,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

export const sourceSubCategory = (): SubCategoryElement => ({
  name: 'Source',
  properties: [
    {
      title: 'Source',
      component: CellComponent.StringCell,
      objectMapping: { text: 'Source' },
    },
  ],
});

export const sourceSubCategoryWithDistinct = (
  mainentity: string
): SubCategoryElement => ({
  name: 'Source',
  properties: [
    {
      title: 'Source',
      component: CellComponent.InputReferenceCell,
      objectMapping: { value: 'Source' },
      params: {
        url: withOdhBaseUrl('/v1/Source?pagesize=-1&typelist=' + mainentity),
        labelSelector: 'Name.{language}',
        keySelector: 'Key',
      },
    },
  ],
});

export const sourceTableCell = (): PropertyConfig => ({
  title: 'Source',
  component: CellComponent.StringCell,
  class: 'w-48',
  objectMapping: { text: 'Source' },
});

export const sourceWithInsertsSubCategory = (
  inserts: { position: number; properties: PropertyConfig[] }[]
) => {
  const sources = sourceSubCategory();
  inserts.forEach((insert) => {
    sources.properties.splice(insert.position, 0, ...insert.properties);
  });
  return sources;
};
