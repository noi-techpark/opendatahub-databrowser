// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  idReadOnlyCell,
  imageGalleryCategory,
  licenseInfoCategory,
  sourceSubCategoryWithDistinct,
  mappingCategory,
  dataStatesSubCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const accommodationRoomsSharedView = ():
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
            idReadOnlyCell(),
            {
              title: 'Accommodation ID (A0RID)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'A0RID' },
              class: 'break-all',
            },
            {
              title: 'Shortname',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
            {
              title: 'Room Code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'RoomCode' },
            },
            {
              title: 'LTS ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'LTSId' },
              class: 'break-all',
            },
            {
              title: 'HGV ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'HGVId' },
              class: 'break-all',
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('accommodationRoom'),
      ],
    },
    {
      name: 'Room Details',
      slug: 'room-details',
      subcategories: [
        {
          name: 'Categorization & Occupancy',
          properties: [
            {
              title: 'Room Type',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Roomtype' },
            },
            {
              title: 'Room Type (numeric)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'RoomtypeInt' },
            },
            {
              title: 'Min Occupancy',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Roommin' },
            },
            {
              title: 'Max Occupancy',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Roommax' },
            },
            {
              title: 'Standard Occupancy',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Roomstd' },
            },
            {
              title: 'Room Quantity',
              component: CellComponent.StringCell,
              objectMapping: { text: 'RoomQuantity' },
            },
            {
              title: 'Room Numbers',
              component: CellComponent.ArrayCell,
              objectMapping: { items: 'RoomNumbers' },
              params: { separator: ', ' },
            },
            {
              title: 'Room Classification Codes',
              component: CellComponent.StringCell,
              objectMapping: { text: 'RoomClassificationCodes' },
            },
          ],
        },
        {
          name: 'Features',
          properties: [
            {
              title: 'Features',
              component: CellComponent.EditAccommodationFeatureCell,
              arrayMapping: {
                pathToParent: 'Features',
                objectMapping: {
                  Id: 'Id',
                  Name: 'Name',
                  HgvId: 'HgvId',
                  OtaCodes: 'OtaCodes',
                  RoomAmenityCodes: 'RoomAmenityCodes',
                },
                targetPropertyName: 'accommodationFeature',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Text information',
      slug: 'text-information',
      subcategories: [
        {
          name: 'Description',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoRoomDetail.{language}.Name' },
            },
            {
              title: 'Long description',
              component: CellComponent.TextAreaCell,
              objectMapping: { text: 'AccoRoomDetail.{language}.Longdesc' },
            },
            {
              title: 'Short description',
              component: CellComponent.TextAreaCell,
              objectMapping: { text: 'AccoRoomDetail.{language}.Shortdesc' },
            },
          ],
        },
      ],
    },
    imageGalleryCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
