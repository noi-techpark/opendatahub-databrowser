// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  accoContactCategory,
  accommodationCategoryCell,
  accommodationTypeCell,
  dataStatesSubCategory,
  gpsDataCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  locationCategory,
  odhTagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  mainImageCell,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { withOdhBaseUrl } from '../../utils';

export const accommodationSharedView = ():
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
            mainImageCell(),
            accommodationTypeCell(),
            accommodationCategoryCell(),
            {
              title: 'Boardings',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'BoardIds',
              },
              params: {
                keySelector: 'Key',
                labelSelector: 'TypeDesc.{language}',
                url: withOdhBaseUrl('/v1/AccommodationTypes?type=Board'),
              },
            },
          ],
        },
        {
          name: 'Characteristics',
          properties: [
            {
              title: 'Room',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'HasApartment' },
            },
            {
              title: 'Gastronomy',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsGastronomy' },
            },
            {
              title: 'Is Bookable',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsBookable' },
            },
            {
              title: 'Features',
              component: CellComponent.ArrayTagsCell,
              objectMapping: {
                items: 'Features',
              },
              params: {
                propertyName: 'Name',
                separator: ', ',
                max: '3',
              },
            },
            {
              title: 'Special Features',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'tags',
                pathToParent: 'SpecialFeaturesIds',
              },
              params: {
                keySelector: 'Key',
                labelSelector: 'TypeDesc.{language}',
                url: withOdhBaseUrl(
                  '/v1/AccommodationTypes?type=SpecialFeature'
                ),
              },
            },
            {
              title: 'Badges',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'tags',
                pathToParent: 'BadgeIds',
              },
              params: {
                keySelector: 'Key',
                labelSelector: 'TypeDesc.{language}',
                url: withOdhBaseUrl('/v1/AccommodationTypes?type=Badge'),
              },
            },
            {
              title: 'Themes',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'tags',
                pathToParent: 'ThemeIds',
              },
              params: {
                keySelector: 'Key',
                labelSelector: 'TypeDesc.{language}',
                url: withOdhBaseUrl('/v1/AccommodationTypes?type=Theme'),
              },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [
            idReadOnlyCell(),
            {
              title: 'HGV ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'HgvId' },
              class: 'break-all',
            },
            {
              title: 'Marketing Group IDs',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'MarketingGroupIds',
              },
              params: {
                separator: ', ',
              },
            },
          ],
        },
        dataStatesSubCategory(),
        {
          name: '',
          properties: [
            {
              title: 'Tourismorganization member',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'TVMember' },
            },
            {
              title: 'Has Rooms',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'HasRoom' },
            },
            {
              title: 'Is Camping',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsCamping' },
            },
            {
              title: 'Is Bookable',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsBookable' },
            },
            //AccoProperties.
            // "HasDorm": null,
            // "HasRoom": true,
            // "TVMember": true,
            // "IsCamping": false,
            // "HasPitches": null,
            // "IsBookable": true,
            // "HasApartment": false,
            // "IsGastronomy": false,
            // "IsAccommodation": true
          ],
        },        
        sourceSubCategoryWithDistinct('accommodation'),
      ],
    },
    {
      name: 'Text information',
      slug: 'text-information',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell(),
            accommodationTypeCell(),
            accommodationCategoryCell(),
            {
              title: 'Long description',
              component: CellComponent.TextAreaCell,
              objectMapping: { text: 'AccoDetail.{language}.Longdesc' },
            },
            {
              title: 'Short description',
              component: CellComponent.TextAreaCell,
              objectMapping: { text: 'AccoDetail.{language}.Shortdesc' },
            },
          ],
        },
      ],
    },
    accoContactCategory(),
    imageGalleryCategory(),
    {
      name: 'Season/ Opening hours',
      slug: 'season-opening-hours',
      subcategories: [
        {
          name: 'Season/ Opening hours',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
          ],
        },
      ],
    },
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('accommodation'),
    {
      name: 'Additional Information',
      slug: 'additional-information',
      subcategories: [
        {
          name: 'LTS specific Information',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
          ],
        },
        {
          name: 'HGV specific Information',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
          ],
        },
        //AccoOverview
        //Acco Booking Info
        //AccoRoomInfo
        //DistanceInfo
        //Trust You Infos (Review)
        //TourismVereinId
      ],
    },
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
