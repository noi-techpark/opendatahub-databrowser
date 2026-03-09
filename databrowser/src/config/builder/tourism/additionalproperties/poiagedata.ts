// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { DetailElements } from '@/domain/datasets/config/types';

export const poiagedataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Age Properties',
  slug: 'poiagedata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [
        {
          title: 'Age From',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.PoiAgeDataProperties.AgeFrom',
          },
          params: { type: 'number' },
        },
        {
          title: 'Age To',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.PoiAgeDataProperties.AgeTo',
          },
          params: { type: 'number' },
        },
      ],
    },
  ],
});
