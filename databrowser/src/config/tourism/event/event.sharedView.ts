// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  contactCategory,
  dataStatesSubCategory,
  gpsDataCategory,
  imageGalleryCategory,
  odhTagCategory,
  shortnameWithLogoAndMainImageSubCategory,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  idReadOnlyCell,
  locationCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        shortnameWithLogoAndMainImageSubCategory(),
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('event'),
      ],
    },
    textInfoCategory(),
    imageGalleryCategory(),
    {
      name: 'Event details',
      slug: 'Event-details',
      subcategories: [
        {
          name: 'Time and date',
          properties: [
            {
              title: 'Date Begin',
              component: CellComponent.DateCell,
              objectMapping: { date: 'DateBegin' },
              params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Date End',
              component: CellComponent.DateCell,
              objectMapping: { date: 'DateEnd' },
              params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Entrance',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Entrance' },
            },
          ],
        },
        {
          name: 'Characteristics',
          properties: [
            {
              title: 'Single Days',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventDate.SingleDays' },
            },
            {
              title: 'Ticket',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ticket' },
            },
          ],
        },
        {
          name: 'Price',
          properties: [
            {
              title: 'Event Price',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventPrice.0' },
            },
            {
              title: 'Type',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Type' },
            },
          ],
        },
        {
          name: 'Additional Information',
          properties: [
            {
              title: 'MinPersons',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventDate.MinPersons' },
            },
            {
              title: 'MaxPersons',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventDate.MaxPersons' },
            },
            {
              title: 'Ranc',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventDate.Ranc' },
            },
            {
              title: 'SignOn',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SignOn' },
            },
            {
              title: 'PayMet',
              component: CellComponent.StringCell,
              objectMapping: { text: 'PayMet' },
            },
            {
              title: 'Classification',
              component: CellComponent.SelectWithOptionsCell,
              objectMapping: {
                value: 'ClassificationRID',
              },
              params: {
                value_001: 'CE212B488FA14954BE91BBCFA47C0F06',
                label_001: 'Event',
                value_002: '4650BDEF28D545CE8AB37138E3C45B80',
                label_002: 'Service',
                value_003: 'E9F80CE8CB3F481ABC7E548CF34A8C1C',
                label_003: 'Reservation',
                value_004: 'D8F5FF743D5741D1BF1F5D61671F552B',
                label_004: 'Permit',
              },
            },
            {
              title: 'Topics',
              component: CellComponent.ArrayTagsCell,
              objectMapping: {
                items: 'Topics',
              },
              params: {
                propertyName: 'TopicInfo',
                separator: ', ',
                max: '3',
              },
            },
          ],
        },
      ],
    },
    contactCategory(),
    {
      name: 'Organizer details',
      slug: 'Organizer-details',
      subcategories: [
        {
          name: 'Organizer Info',
          properties: [
            {
              title: 'Company / Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.CompanyName' },
            },
            {
              title: 'Tax Number',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Tax' },
            },
            {
              title: 'Vat',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Vat' },
            },
          ],
        },
        {
          name: 'Address',
          properties: [
            {
              title: 'Address',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Address' },
            },
            {
              title: 'Zip Code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.ZipCode' },
            },
            {
              title: 'Country Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.CountryName' },
            },
            {
              title: 'Country Code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.CountryCode' },
            },
          ],
        },
        {
          name: 'Contact details',
          properties: [
            {
              title: 'Email',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Email' },
            },
            {
              title: 'Phonenumber',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Phonenumber' },
            },
            {
              title: 'Url',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OrganizerInfos.{language}.Url' },
            },
          ],
        },
      ],
    },
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('event'),
    licenseInfoCategory(),
    mappingCategory(),
    {
      name: 'Other',
      slug: 'other',
      subcategories: [
        {
          name: 'Various Ids',
          properties: [
            {
              title: 'Area Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'LocationInfo.AreaInfo.Id' },
            },
          ],
        },
        {
          name: 'Deprecated',
          properties: [
            {
              title: 'Active on Open Data Hub',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'SmgActive' },
            },
          ],
        },
      ],
    },
    updatehistoryCategory(),
  ],
});
