// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../../domain/cellComponents/types';
import { DetailElements } from '../../../../domain/datasets/config/types';

export const gastronomyltsdataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Gastronomy Properties',
  slug: 'gastronomyltsdata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [       
        {
          title: 'Max SeatingCapacity',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.GastronomyLtsDataProperties.MaxSeatingCapacity',
          },
          params: { type: 'number' },
        },       
      ],
    },   
  ],
});
