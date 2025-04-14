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
  tagCategory,
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
          ],
        },
      ],
    },
    {
      name: 'Event Properties',
      slug: 'Evnt-properties',
      subcategories: [       
        {
          name: 'Characteristics',
          properties: [
            {
              title: 'Ticket Required',                            
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'EventProperty.TicketRequired' },
            },
            {
              title: 'Registration Required',                            
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'EventProperty.RegistrationRequired' },
            },
            {
              title: 'Included in SuedtirolGuestPass',                            
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'EventProperty.IncludedInSuedtirolGuestPass' },
            },
            {
              title: 'Is Bookable',                            
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'EventProperty.IsBookable' },
            },
            {
              title: 'Event Organizer ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventProperty.EventOrganizerId' },
            },
            {
              title: 'Classification',
              component: CellComponent.SelectWithOptionsCell,
              objectMapping: {
                value: 'EventProperty.EventClassificationId',
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
          ],
        },               
      ],
    },
    {
      name: 'Additional Information',
      slug: 'event-additional',
      subcategories: [
        {
          name: 'General',
          properties: [
            {
              title: 'Registration',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                text: 'EventAdditionalInfos.{language}.Registration',
              },
            },
            {
              title: 'Meeting Point',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                text: 'EventAdditionalInfos.{language}.MeetingPoint',
              },
            },
            {
              title: 'Location',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                enabled: 'EventAdditionalInfos.{language}.Location',
              },
            },
            {
              title: 'What To Bring',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                text: 'EventAdditionalInfos.{language}.WhatToBring',
              },
            },
            {
              title: 'ServiceDescription',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                text: 'EventAdditionalInfos.{language}.ServiceDescription',
              },
            },
            {
              title: 'CancellationModality',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                text: 'EventAdditionalInfos.{language}.CancellationModality',
              },
            },
          ],
        },
        {
          name: 'Additional Text',
          properties: [
            {
              title: 'Author Tip',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'Detail.{language}.AuthorTip',
              },
            },
            {
              title: 'Parking Info',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.ParkingInfo' },
            },
            {
              title: 'Public Transportation Info',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'Detail.{language}.PublicTransportationInfo',
              },
            },
            {
              title: 'Safety Info',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.SafetyInfo' },
            },
            {
              title: 'Equipment Info',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.EquipmentInfo' },
            },
          ],
        },
      ],
    },
    //TO ADD EventDate, EventVariant, EventBooking
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
    {
      name: 'Event Info',
      slug: 'event-info',
      subcategories: [
        {
          name: 'Event Publisher',
          properties: [
            {
              title: 'Event Publisher',
              component: CellComponent.EditEventPublisherCell,
              arrayMapping: {
                pathToParent: 'EventPublisher',
                objectMapping: {
                  PublisherRID: 'PublisherRID',
                  Ranc: 'Ranc',
                  PublicationStatus: 'PublicationStatus',
                },
                targetPropertyName: 'eventPublisher',
              },
            },
          ]
        },
        {
          name: 'Event Urls',
          properties: [
            {
              title: 'Event Urls',
              component: CellComponent.EditEventUrlCell,
              arrayMapping: {
                pathToParent: 'EventUrls',
                objectMapping: {
                  Type: 'Type',
                  Url: 'Url.{language}',
                  Active: 'Active',
                },
                targetPropertyName: 'eventUrls',
              },
            },
          ]
        }
      ],
    },
    locationCategory(),
    gpsDataCategory(),
    tagCategory('event'),
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
        {
          name: 'Event Topics',
          properties:[
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
          ]
        },
      ],
    },
    updatehistoryCategory(),
  ],
});
