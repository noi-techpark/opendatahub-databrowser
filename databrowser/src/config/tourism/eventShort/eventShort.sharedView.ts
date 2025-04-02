// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  eventDocumentCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  lastChangesCell,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
  tagCategory,
} from '../../builder/tourism';
import { publishedOnCell } from '../../builder/tourism/publishedOn';
import { videoItemsCategory } from '../../builder/tourism/video';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { withOdhBaseUrl } from '../../utils';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventShortSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Shortname',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
            {
              title: 'Title',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventTitle.{language}' },
            },
            {
              title: 'Description',
              component: CellComponent.TextAreaCell,
              objectMapping: { text: 'EventText.{language}' },
              params: { rows: '4' },
            },
            {
              title: 'Organizer',
              component: CellComponent.StringCell,
              objectMapping: { text: 'CompanyName' },
            },
            {
              title: 'External organizer',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'ExternalOrganizer' },
            },
            {
              title: 'Sold out',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'SoldOut' },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        {
          name: 'Data states',
          properties: [
            lastChangesCell(),
            publishedOnCell(),
            {
              title: 'Active on Source',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Active' },
            },
          ],
        },
        sourceSubCategoryWithDistinct('eventshort'),
      ],
    },
    {
      name: 'Event details',
      slug: 'event-details',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: 'Web-URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'WebAddress' },
              class: 'break-all',
            },
            {
              title: 'Video-URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'VideoUrl' },
              class: 'break-all',
            },
            {
              title: 'Date start',
              component: CellComponent.DateCell,
              objectMapping: { date: 'StartDate' },
              params: { format: DEFAULT_DATE_TIME_FORMAT, type: 'datetime' },
              required: true,
            },
            {
              title: 'Date end',
              component: CellComponent.DateCell,
              objectMapping: { date: 'EndDate' },
              params: { format: DEFAULT_DATE_TIME_FORMAT, type: 'datetime' },
              required: true,
            },
            {
              title: 'Room name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AnchorVenue' },
              required: true,
            },
            {
              title: 'Age From',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TypicalAgeRange.AgeFrom' },
            },
            {
              title: 'Age To',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TypicalAgeRange.AgeTo' },
            },
            {
              title: 'Location',
              component: CellComponent.InputReferenceCell,
              objectMapping: { value: 'EventLocation' },
              params: {
                url: withOdhBaseUrl('/v1/EventShortTypes?type=EventLocation'),
                labelSelector: 'TypeDesc.{language}',
                keySelector: 'Key',
              },
              required: true,
            },
            // {
            //   title: 'Technology Fields',
            //   component: CellComponent.TagReferenceCell,
            //   arrayMapping: {
            //     targetPropertyName: 'tags',
            //     pathToParent: 'TechnologyFields',
            //   },
            //   params: {
            //     url: withOdhBaseUrl(
            //       '/v1/EventShortTypes?type=TechnologyFields'
            //     ),
            //     labelSelector: 'TypeDesc.{language}',
            //     keySelector: 'Key',
            //     unique: 'true',
            //   },
            // },
            // {
            //   title: 'Tagging Fields',
            //   component: CellComponent.TagReferenceCell,
            //   arrayMapping: {
            //     targetPropertyName: 'tags',
            //     pathToParent: 'CustomTagging',
            //   },
            //   params: {
            //     url: withOdhBaseUrl('/v1/EventShortTypes?type=CustomTagging'),
            //     labelSelector: 'TypeDesc.{language}',
            //     keySelector: 'Key',
            //     unique: 'true',
            //   },
            // },
            {
              title: 'Room Management',
              component: CellComponent.EditRoomBookedCell,
              arrayMapping: {
                pathToParent: 'RoomBooked',
                objectMapping: {
                  space: 'Space',
                  spaceDesc: 'SpaceDesc',
                  spaceAbbrev: 'SpaceAbbrev',
                  spaceType: 'SpaceType',
                  subtitle: 'Subtitle',
                  comment: 'Comment',
                  startDate: 'StartDate',
                  endDate: 'EndDate',
                  startDateUTC: 'StartDateUTC',
                  endDateUTC: 'EndDateUTC',
                  spaceDescRoomMapping: 'SpaceDescRoomMapping',
                },
                targetPropertyName: 'roomBooked',
              },
            },
          ],
        },
      ],
    },
    tagCategory('eventshort'),
    imageGalleryCategory(),
    videoItemsCategory(),
    eventDocumentCategory(),
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
              title: 'Event EBMS Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventId' },
            },
          ],
        },
        {
          name: '',
          properties: [
            {
              title: 'Active',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'ActiveToday' },
              params: { readonly: 'true' },
            },
            {
              title: 'noi.bz.it Active',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'ActiveWeb' },
              params: { readonly: 'true' },
            },
            {
              title: 'NOI Community App Active',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'ActiveCommunityApp' },
              params: { readonly: 'true' },
            },
          ],
        },
      ],
    },
    updatehistoryCategory(),
  ],
});
