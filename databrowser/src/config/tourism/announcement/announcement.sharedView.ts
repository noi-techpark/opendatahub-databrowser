// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  dataStatesSubCategory,
  tagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
  idReadOnlyCell,
} from '../../builder/tourism';
import { geoDataCategory } from '../../builder/tourism/geoData';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { additionalPropertiesCategory } from '../../builder/tourism/additionalProperties';

export const announcementSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell(),
            {
              title: 'Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.BaseText' },
              class: 'break-all',
            },
            
          ],
        },
        {
          name: 'IDs',
          properties: [
            idReadOnlyCell(),
          ],
        },
        {
          name: 'Time',
          properties: [
            {
              title: 'Start Time',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'StartTime', readonly: 'true' },
              class: 'break-all',
            },
            {
              title: 'End Time',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'EndTime', readonly: 'true' },
              class: 'break-all',
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('announcement'),
      ],
    },
    geoDataCategory(),
    tagCategory(''),
    additionalPropertiesCategory(),
    {
      name: 'Road Information',
      slug: 'road-info',
      subcategories: [
        {
          name: 'Roads',
          properties: [
            {
              title: 'Roads Involved',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'roads',
                pathToParent: 'AdditionalProperties.RoadIncidentProperties.RoadsInvolved',
                // Nested properties for each road
                properties: [
                  {
                    title: 'Road Code',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'Code' },
                  },
                  {
                    title: 'Road Name',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'Name' },
                  },
                  {
                    title: 'Affected Lanes',
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'lanes',
                      pathToParent: 'Lanes',
                      // Nested properties for each lane
                      properties: [
                        {
                          title: 'Lane Number',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'Lane' },
                        },
                        {
                          title: 'Lane Name',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'LaneName' },
                        },
                        {
                          title: 'Direction',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'Direction' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ]
        }
      ]
    },
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
