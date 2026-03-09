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

export const tripSharedView = ():
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
              title: 'Title',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Route.Detail.{language}.Title' },
            },
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
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('trip'),
      ],
    },
    {
      name: 'Calendar',
      slug: 'calendar',
      subcategories: [
        {
          name: 'Operation Schedule',
          properties: [
            {
              title: 'Start',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'Route.Calendar.OperationSchedule.Start' },
            },
            {
              title: 'Stop',
              component: CellComponent.EditedDateCell,
              objectMapping: { date: 'Route.Calendar.OperationSchedule.Stop' },
            },
            {
              title: 'Type',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Route.Calendar.OperationSchedule.Type' },
            },
          ],
        },
        {
          name: 'Operation Schedule Times',
          properties: [
            {
              title: 'Schedule Times',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'operationScheduleTimes',
                pathToParent: 'Route.Calendar.OperationSchedule.OperationScheduleTime',
                properties: [
                  {
                    title: 'Start',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'Start' },
                  },
                  {
                    title: 'End',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'End' },
                  },
                  {
                    title: 'State',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'State' },
                  },
                  {
                    title: 'Monday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Monday' },
                  },
                  {
                    title: 'Tuesday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Tuesday' },
                  },
                  {
                    title: 'Wednesday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Wednesday' },
                  },
                  {
                    title: 'Thursday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Thursday' },
                  },
                  {
                    title: 'Friday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Friday' },
                  },
                  {
                    title: 'Saturday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Saturday' },
                  },
                  {
                    title: 'Sunday',
                    component: CellComponent.ToggleCell,
                    objectMapping: { enabled: 'Sunday' },
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'Additional Calendar Data',
          properties: [
            {
              title: 'Excluded Dates',
              component: CellComponent.JsonCell,
              objectMapping: { data: 'Route.Calendar.ExcludedDates' },
            },
            {
              title: 'Additional Dates',
              component: CellComponent.JsonCell,
              objectMapping: { data: 'Route.Calendar.AdditionalDates' },
            },
          ],
        },
      ],
    },
    {
      name: 'Agency',
      slug: 'agency',
      subcategories: [
        {
          name: 'Company data',
          properties: [
            {
              title: 'Shortname',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Agency.Shortname' },
            },
            {
              title: 'Company Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Agency.ContactInfos.{language}.CompanyName' },
            },
          ],
        },
        {
          name: 'Contact details',
          properties: [
            {
              title: 'URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'Agency.ContactInfos.{language}.Url' },
            },
            {
              title: 'E-Mail',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Agency.ContactInfos.{language}.Email' },
            },
            {
              title: 'Phone Number',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Agency.ContactInfos.{language}.Phonenumber' },
            },
          ],
        },
      ],
    },
    {
      name: 'Stop Times',
      slug: 'stop-times',
      subcategories: [
        {
          name: 'Stops',
          properties: [
            {
              title: 'Stop Times',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'stopTimes',
                pathToParent: 'StopTimes',
                properties: [
                  {
                    title: 'Shortname',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'Shortname' },
                  },
                  {
                    title: 'Title',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'Detail.{language}.Title' },
                  },
                  {
                    title: 'Arrival Time',
                    component: CellComponent.EditedDateCell,
                    objectMapping: { date: 'ArrivalTime' },
                  },
                  {
                    title: 'Departure Time',
                    component: CellComponent.EditedDateCell,
                    objectMapping: { date: 'DepartureTime' },
                  },
                  {
                    title: 'Geo Data',
                    class: 'w-96',
                    component: CellComponent.EditGeoDataCell,
                    objectMapping: { geoData: 'Geo' },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    geoDataCategory(),
    tagCategory(''),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
