// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../../domain/cellComponents/types';
import { DetailElements } from '../../../../domain/datasets/config/types';

export const activityltsdataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Activity Properties',
  slug: 'activityltsdata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [       
        {
          title: 'Altitude Difference',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.ActivityLtsDataProperties.AltitudeDifference',
          },
          params: { type: 'number' },
        },        
      ],
    },   
  ],
});