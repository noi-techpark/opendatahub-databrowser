// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { DetailElements } from '../../../domain/datasets/config/types';

export const roadIncidentdataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Road Incident Properties',
  slug: 'roadIncidentdata',
  visible: options.visible,
  subcategories: [
    {
      name: 'Roads involved',
      properties: [
         {
           title: 'Road code',
           component: CellComponent.DictionaryCell,
           objectMapping: {
             dictitems: 'AdditionalProperties.RoadIncidentProperties.RoadsInvolved',
            }
          },
        ],
    },
    {
      name: 'Delay information',
      properties: [
        {
          title: 'Expected Delay (Sring)',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.RoadIncidentProperties.ExpectedDelayString',
          },
        },
        {
          title: 'Expected Delay (Minutes)',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.RoadIncidentProperties.ExpectedDelayMinutes',
          },
        },
      ],
    },
  ],
});