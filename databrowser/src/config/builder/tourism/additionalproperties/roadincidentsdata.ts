// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../../domain/cellComponents/types';
import { DetailElements } from '../../../../domain/datasets/config/types';

export const roadincidentsataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Road Incidents Properties',
  slug: 'roadincidentsdata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [       
        {
          title: 'ExpectedDelayMinutes',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.RoadIncidentProperties.ExpectedDelayMinutes ',
          },
          params: { type: 'number' },
        },
        {
          title: 'ExpectedDelayString',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.RoadIncidentProperties.ExpectedDelayString ',
          },
        },
      ],
    },   
  ],
});