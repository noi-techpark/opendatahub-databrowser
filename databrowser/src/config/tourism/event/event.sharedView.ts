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
  eventDocumentCategory,
  shortnameWithLogoAndMainImageSubCategory,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  idReadOnlyCell,
  locationCategory,
  licenseInfoCategory,
  mappingCategory,
  tagCategory,
  eventPropertiesCategory,
  eventAdditionalCategory,
  eventDateCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { additionalPropertiesCategory } from '../../builder/tourism/additionalProperties';
import { videoItemsCategory } from '../../builder/tourism/video';

export const eventSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        sourceSubCategoryWithDistinct('event'),
        shortnameWithLogoAndMainImageSubCategory(),        
        dataStatesSubCategory(),        
      ],
    },
    textInfoCategory(),
    eventAdditionalCategory(),
    imageGalleryCategory(),
    eventDateCategory(),   
    eventPropertiesCategory(),
    contactCategory(),
    {
      name: 'Organizer',
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
    additionalPropertiesCategory(),
    locationCategory(),
    gpsDataCategory(),
    tagCategory('event', {
      withSourceFilter: true,
      sourceOverrides: {
        noi: 'noi,nobis,eurac',
        ebms: 'noi,nobis,eurac',
        momentus: 'noi,nobis,eurac',
        wnet: 'wnet,noi,studipink,retealfemminile',
        studiopink: 'wnet,noi,studipink,retealfemminile',
        retealfemminile: 'wnet,noi,studipink,retealfemminile',
        peer: 'peer,noi',
      },
    }),
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
          properties: [
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
    updatehistoryCategory(),
  ],
});
