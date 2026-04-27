// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { PropertyConfig } from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

export const publishedOnCell = (): PropertyConfig => {
  return {
    title: 'Published on',
    component: CellComponent.ArrayLookupCell,
    objectMapping: { items: 'PublishedOn' },
    params: {
      lookupUrl: withOdhBaseUrl('/v1/Publisher?pagesize=-1'),
      labelSelector: 'Name.{language}',
      keySelector: 'Id',
      unique: 'true',
      addLabel: 'Add new Publisher',
    },
  };
};

export const publishedOnTableCell = (): PropertyConfig => ({
  title: 'Published on',
  component: CellComponent.ArrayCell,
  class: 'w-40',
  objectMapping: { items: 'PublishedOn' },
  params: { separator: ', ' },
});
