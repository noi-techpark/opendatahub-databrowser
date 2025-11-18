// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { EditElements } from '../../../domain/datasets/config/types';
import { echargingdataCategory } from './echargingdata';
import { roadIncidentdataCategory } from './roadIncident';

export const additionalPropertiesCategory = (): EditElements => ({
  name: 'Additional properties',
  slug: 'additional-properties',
  subcategories: [
    {
      name: '',
      properties: [
        {
          title: '',
          component: CellComponent.AdditionalPropertiesCell,
          objectMapping: {
            additionalProperties: 'AdditionalProperties',
          },
        },
      ],
    },
  ],
  subElements: [
    {
      objectPath: 'AdditionalProperties.EchargingDataProperties',
      elements: echargingdataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.RoadIncidentProperties',
      elements: roadIncidentdataCategory(),
    },
  ],
});
