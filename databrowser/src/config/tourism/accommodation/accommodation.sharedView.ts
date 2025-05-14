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
  tagCategory,
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
              //TODO Display features better
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
      name: 'Properties',
      slug: 'properties',
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
          //To check if a new component has to be made here because of Dictionary
          name: 'Trust You ',
          properties: [
            {
              title: 'Score',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Review.trustyou.Score' },
            },
            {
              title: 'Results',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Review.trustyou.Results' },
            },
            {
              title: 'State',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Review.trustyou.State' },
            },
            {
              title: 'ReviewId',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Review.trustyou.ReviewId' },
            },
            {
              title: 'Active',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Review.trustyou.Active' },
            },
            {
              title: 'Provider',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Review.trustyou.Provider' },
            },
          ],
        },
        {
          name: 'Accommodation Overview',
          properties: [
            {
              title: 'TotalRooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.TotalRooms' },
            },
            {
              title: 'SingleRooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.SingleRooms' },
            },
            {
              title: 'DoubleRooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.DoubleRooms' },
            },
            {
              title: 'TripleRooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.TripleRooms' },
            },
            {
              title: 'QuadrupleRooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.QuadrupleRooms' },
            },
            {
              title: 'Apartments',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.Apartments' },
            },
            {
              title: 'ApartmentBeds',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.ApartmentBeds' },
            },
            {
              title: 'MaxPersons',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.MaxPersons' },
            },
            {
              title: 'OutdoorParkings',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.OutdoorParkings' },
            },
            {
              title: 'GarageParkings',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.GarageParkings' },
            },
            {
              title: 'CampingUnits',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CampingUnits' },
            },
            {
              title: 'CampingWashrooms',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CampingWashrooms' },
            },
            {
              title: 'CampingDouches',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CampingDouches' },
            },
            {
              title: 'CampingToilettes',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CampingToilettes' },
            },
            {
              title: 'CampingWashingstands',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CampingWashingstands' },
            },
            {
              title: 'ApartmentRoomSize',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.ApartmentRoomSize' },
            },
            {
              title: 'CheckInFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CheckInFrom' },
            },
            {
              title: 'CheckInTo',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CheckInTo' },
            },
            {
              title: 'CheckOutFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CheckOutFrom' },
            },
            {
              title: 'CheckOutTo',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.CheckOutTo' },
            },
            {
              title: 'ReceptionOpenFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.ReceptionOpenFrom' },
            },
            {
              title: 'ReceptionOpenTo',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.ReceptionOpenTo' },
            },
            {
              title: 'RoomServiceFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.RoomServiceFrom' },
            },
            {
              title: 'RoomServiceTo',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.RoomServiceTo' },
            },
            {
              title: 'BaggageServiceFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.BaggageServiceFrom' },
            },
            {
              title: 'BaggageServiceTo',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoOverview.BaggageServiceTo' },
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
          name: '',
          properties: [
            {
              title: 'Tourism Organization Owner',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TourismVereinId' },
            },
            {
              title: 'District',
              component: CellComponent.StringCell,
              objectMapping: { text: 'DistrictId' },
            },
            //Representation
            //IndependentData
          ],
        },
        {
          name: 'Booking Information',
          properties: [
            {
              title: 'Booking Information',
              component: CellComponent.EditAccommodationBookingCell,
              arrayMapping: {
                pathToParent: 'AccoBookingChannel',
                objectMapping: {
                  Id: 'Id',
                  Portalname: 'Portalname',
                  BookingId: 'BookingId',
                  Pos1ID: 'Pos1ID',
                },
                targetPropertyName: 'accommodationBooking',
              },
            },
          ],
        },
        {
          name: 'LTS specific Information',
          properties: [
            {
              title: 'Price From',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoLTSInfo.PriceFrom' },
            },
            {
              title: 'Price From per Unit',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoLTSInfo.PriceFromPerUnit' },
            },
          ],
        },
        {
          name: 'HGV specific Information',
          properties: [
            {
              title: 'PriceFrom',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AccoHGVInfo.PriceFrom' },
            },
            {
              title: 'AvailableFrom',
              component: CellComponent.DateCell,
              objectMapping: { date: 'AccoHGVInfo.AvailableFrom' },
            },
            {
              title: 'Bookable',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'AccoHGVInfo.Bookable' },
            },
          ],
        },
        {
          name: 'Room Information',
          properties: [
            {
              title: 'Room Information',
              component: CellComponent.EditAccommodationRoomCell,
              
              arrayMapping: {
                pathToParent: 'AccoRoomInfo',
                objectMapping: {
                  Id: 'Id',
                  Source: 'Source',
                },
                targetPropertyName: 'accommodationRoom',
              },
            },
          ],
        },
      ],
    },
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('accommodation'),
    tagCategory('accommodation'),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
