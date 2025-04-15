// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventDocumentCell = (): PropertyConfig => ({
  title: 'PDFs',
  component: CellComponent.EventDocumentCell,
  arrayMapping: {
    targetPropertyName: 'files',
    pathToParent: 'Documents.{language}',
    objectMapping: {
      src: 'DocumentURL',
      language: 'Language',
      documentName: 'DocumentName',
    },
  },
});

export const eventDocumentCategory = (): DetailElements => ({
  name: 'Files',
  slug: 'files',
  subcategories: [
    {
      name: '',
      properties: [eventDocumentCell()],
    },
  ],
});

export const eventPropertiesCategory = (): DetailElements => ({
  name: 'Event Properties',
  slug: 'Event-properties',
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
          objectMapping: {
            enabled: 'EventProperty.IncludedInSuedtirolGuestPass',
          },
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
      ],
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
      ],
    },
    {
      name: 'Booking',
      properties: [
        {
          title: 'Bookable From',
          component: CellComponent.DateCell,
          objectMapping: { date: 'EventBooking.BookableFrom' },
          params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
        },
        {
          title: 'Bookable To',
          component: CellComponent.DateCell,
          objectMapping: { date: 'EventBooking.BookableFrom' },
          params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
        },
        {
          title: 'Booking Active',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: { enabled: 'EventBooking.BookingActive' },
        },
        {
          title: 'BookingUrl',
          component: CellComponent.StringCell,
          objectMapping: { text: 'EventBooking.BookingUrl.{language}.Url' },
        },
      ],
    },
  ],
});

export const eventAdditionalCategory = (): DetailElements => ({
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
});

export const eventDateCategory = (): DetailElements => ({
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
      ],
    },
    {
      name: 'Event Dates',
      properties: [
        {
          title: 'Event Dates',
          component: CellComponent.EditEventDateCell,
          arrayMapping: {
            pathToParent: 'EventDate',
            objectMapping: {
              From: 'From',
              To: 'To',
              Begin: 'Begin',
              End: 'End',
              Entrance: 'Entrance',
              PriceFrom: 'PriceFrom',
              Active: 'Active',
              IsBookable: 'IsBookable',
              SingleDays: 'SingleDays',
              IsCancelled: 'IsCancelled',
              MinPersons: 'MinPersons',
              MaxPersons: 'MaxPersons',
            },
            targetPropertyName: 'eventDates',
          },
        },
      ],
    },
    {
      name: 'Event Variants',
      properties: [
        {
          title: 'Event Variant',
          component: CellComponent.EditEventVariantCell,
          arrayMapping: {
            pathToParent: 'EventVariants',
            objectMapping: {
              Price: 'Price',
              VariantId: 'VariantId',
              VariantCategoryId: 'VariantCategoryId',
              Name: 'Name.{language}',
              IsStandard: 'IsStandard',
              Order: 'Order',
            },
            targetPropertyName: 'eventVariant',
          },
        },
      ],
    },
  ],
});
