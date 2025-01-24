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
  idReadOnlyCell,
  imageGalleryCategory,
  licenseInfoCategory,
  locationCategory,
  logoWithMainImageCells,
  odhTagCategory,
  seasonCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
} from '../../builder/tourism';
import { additionalPropertiesCategory } from '../../builder/tourism/additionalProperties';
import { mappingCategory } from '../../builder/tourism/mapping';
import { relatedcontentCategory } from '../../builder/tourism/relatedcontent';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { videoItemsCategory } from '../../builder/tourism/video';
import { withOdhBaseUrl } from '../../utils';

export const odhActivityPoiSharedView = ():
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
              objectMapping: {
                text: 'Detail.{language}.Title',
              },
            },
            ...logoWithMainImageCells(),
          ],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct(''),
        {
          name: '',
          properties: [
            {
              title: 'Source Interface',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SyncSourceInterface' },
            },
            {
              title: 'Update mode',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SyncUpdateMode' },
            },
          ],
        },
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    videoItemsCategory(),
    additionalPropertiesCategory(),
    seasonCategory(),
    locationCategory(),
    gpsDataCategory(),
    odhTagCategory('odhactivitypoi'),
    {
      name: 'Ratings',
      slug: 'ratings',
      subcategories: [
        {
          name: 'Rating Data',
          properties: [
            {
              title: 'Stamina',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ratings.Stamina' },
            },
            {
              title: 'Experience',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ratings.Experience' },
            },
            {
              title: 'Landscape',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ratings.Landscape' },
            },
            {
              title: 'Difficulty',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ratings.Difficulty' },
            },
            {
              title: 'Technique',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Ratings.Technique' },
            },
          ],
        },
      ],
    },
    {
      name: 'Details',
      slug: 'odhactivitypoi-details',
      subcategories: [
        {
          name: 'Characteristics',
          properties: [
            {
              title: 'Altitude difference (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeDifference' },
            },
            {
              title: 'Altitude Highest Point (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeHighestPoint' },
            },
            {
              title: 'Altitude Lowest Point (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeLowestPoint' },
            },
            {
              title: 'Altitude Sum Up (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeSumUp' },
            },
            {
              title: 'Altitude Sum Down (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeSumDown' },
            },
            {
              title: 'Length (m)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'DistanceLength' },
            },
            {
              title: 'Duration (hh:mm)',
              component: CellComponent.StringCell,
              objectMapping: { text: 'DistanceDuration' },
            },
            {
              title: 'Number',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Number' },
            },
            {
              title: 'Way Number',
              component: CellComponent.StringCell,
              objectMapping: { text: 'WayNumber' },
            },
            {
              title: 'Exposition',
              component: CellComponent.ArrayEditableCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'Exposition',
              },
              required: false,
            },
          ],
        },
        {
          name: 'Properties',
          properties: [
            {
              title: 'Highlight',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Highlight' },
            },
            {
              title: 'Open',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsOpen' },
            },
            {
              title: 'Free entrance',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'HasFreeEntrance' },
            },
            {
              title: 'Prepared',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsPrepared' },
            },
            {
              title: 'With Light',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'IsWithLigth' },
            },
            {
              title: 'Has Rental',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'HasRentals' },
            },
            {
              title: 'Run to Valley',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'RunToValley' },
            },
            {
              title: 'Lift Available',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'LiftAvailable' },
            },
            {
              title: 'Feet Climb',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'FeetClimb' },
            },
            {
              title: 'Bike Transport',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'BikeTransport' },
            },
          ],
        },
        {
          name: 'Target Group',
          properties: [
            {
              title: 'Age from',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AgeFrom' },
            },
            {
              title: 'Age to',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AgeTo' },
            },
          ],
        },
      ],
    },
    {
      name: 'Additional Information',
      slug: 'poi-additional',
      subcategories: [
        {
          name: 'General',
          properties: [
            {
              title: 'Novelty',
              component: CellComponent.TextAreaCell,
              objectMapping: {
                enabled: 'AdditionalPoiInfos.{language}.Novelty',
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
    //webcamCategory(),
    relatedcontentCategory(),
    licenseInfoCategory(),
    {
      name: 'Other',
      slug: 'other',
      subcategories: [
        {
          name: 'Various Ids',
          properties: [
            {
              title: 'Owner ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OwnerRid' },
              class: 'break-all',
            },
            {
              title: 'Tourism organization Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TourismorganizationId' },
            },
            {
              title: 'Outdoor Active ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OutdooractiveID' },
            },
            {
              title: 'Outdoor Active Elevation ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'OutdooractiveElevationID' },
            },
            {
              title: 'Smg ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SmgId' },
            },
            {
              title: 'Area IDs',
              component: CellComponent.ArrayEditableCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'AreaId',
              },
              required: false,
            },
          ],
        },
        {
          name: 'Deprecated',
          properties: [
            {
              title: 'Custom Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'CustomId' },
              class: 'break-all',
            },
            {
              title: 'Copyright Checked',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'CopyrightChecked' },
              class: 'break-all',
            },
            {
              title: 'Main type / Type',
              component: CellComponent.InputReferenceCell,
              objectMapping: { value: 'Type' },
              params: {
                url: withOdhBaseUrl('/v1/ODHActivityPoiTypes'),
                labelSelector: 'TypeDesc.{language}',
                keySelector: 'Key',
              },
            },
            {
              title: 'Sub Type',
              component: CellComponent.InputReferenceCell,
              objectMapping: { value: 'SubType' },
              params: {
                url: withOdhBaseUrl('/v1/ODHActivityPoiTypes'),
                labelSelector: 'TypeDesc.{language}',
                keySelector: 'Key',
              },
            },
            {
              title: 'POI Type',
              component: CellComponent.InputReferenceCell,
              objectMapping: { value: 'PoiType' },
              params: {
                url: withOdhBaseUrl('/v1/ODHActivityPoiTypes'),
                labelSelector: 'TypeDesc.{language}',
                keySelector: 'Key',
              },
            },
            {
              title: 'Difficulty',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Difficulty' },
            },
            {
              title: 'Active on Open Data Hub',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'SmgActive' },
            },
          ],
        },
        {
          name: 'Auto generated',
          properties: [
            {
              title: 'Categories',
              component: CellComponent.ArrayEditableCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'AdditionalPoiInfos.{language}.Categories',
              },
            },
          ],
        },
      ],
    },
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
