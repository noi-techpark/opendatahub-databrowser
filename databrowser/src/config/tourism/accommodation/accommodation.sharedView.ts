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
        sourceSubCategoryWithDistinct('accommodation'),
      ],
    },
    {
      name: 'Categorization',
      slug: 'accommodation-categorization',
      subcategories: [
        {
          name: 'Characteristics',
          properties: [
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
      ],
    },
    {
      name: 'Accommodation Properties',
      slug: 'accommodation-properties',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: 'Tourismorganization member',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.TVMember' },
            },
            {
              title: 'Has Rooms',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.HasRoom' },
            },
            {
              title: 'Has Dorm',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.HasDorm' },
            },
            {
              title: 'Is Camping',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.IsCamping' },
            },
            {
              title: 'Has Pitches',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.HasPitches' },
            },
            {
              title: 'Is Bookable',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.IsBookable' },
            },
            {
              title: 'Has Apartment',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.HasApartment' },
            },
            {
              title: 'Is Gastronomy',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.IsGastronomy' },
            },
            {
              title: 'Is Accommodation',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.IsAccommodation' },
            },
          ],
        },
        {
          name: 'Trust You ',
          properties: [
            {
              title: 'Tourismorganization member',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoProperties.TVMember' },
            },
          ],
        },
        //AccoOverview
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
    {
      name: 'Additional Information',
      slug: 'additional-information',
      subcategories: [
        {
          name: 'Booking Information',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
          ],
        },
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
        {
          name: 'Accommodation Room Information',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Shortname' },
            },
          ],
        },
        
        //Acco Booking Info
        //AccoRoomInfo
        //DistanceInfo
        //Trust You Infos (Review)
        //TourismVereinId
      ],
    },
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('accommodation'),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
