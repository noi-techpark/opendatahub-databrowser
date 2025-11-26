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
            title: 'Roads',
            component: CellComponent.EditNestedArrayCell,
            arrayMapping: {
              targetPropertyName: 'roads',
              pathToParent: 'RoadInvolved',
              properties: [
                {
                  title: 'Road Name',
                  component: CellComponent.StringCell,
                  objectMapping: { text: 'Name' }
                },
                {
                  title: 'Road Code',
                  component: CellComponent.StringCell,
                  objectMapping: { text: 'Code' }
                },
                {
                  title: 'Lanes',
                  component: CellComponent.EditNestedArrayCell,
                  arrayMapping: {
                    targetPropertyName: 'lanes',
                    pathToParent: 'Lanes',
                    properties: [
                      {
                        title: 'Lane Name',
                        component: CellComponent.StringCell,
                        objectMapping: { text: 'LaneName' }
                      },
                      {
                        title: 'Direction',
                        component: CellComponent.StringCell,
                        objectMapping: { text: 'Direction' }
                      },
                    ]
                  }
                },
              ]
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