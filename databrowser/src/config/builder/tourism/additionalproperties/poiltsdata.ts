// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../../domain/cellComponents/types';
import { DetailElements } from '../../../../domain/datasets/config/types';

export const poiltsdataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Poi Properties',
  slug: 'poiltsdata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [       
        {
          title: 'Is Open',
          component: CellComponent.ToggleTriStateCell,            
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsOpen',
          },
        },
        {
          title: 'Has FreeEntrance',
          component: CellComponent.ToggleTriStateCell,            
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasFreeEntrance',
          },
        },
      ],
    },   
  ],
});
