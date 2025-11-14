// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { App } from 'vue';

import AdditionalPropertiesCell from '../components/cells/additionalPropertiesCell/AdditionalPropertiesCell.vue';
import ArrayCell from '../components/cells/arrayCell/ArrayCell.vue';
import ArrayEditableCell from '../components/cells/arrayCell/ArrayEditableCell.vue';
import ArrayLookupCell from '../components/cells/arrayLookupCell/ArrayLookupCell.vue';
import ArrayTagsCell from '../components/cells/arrayTagsCell/ArrayTagsCell.vue';
import ArticleAdditionalInfoCell from '../components/cells/articleAdditionalInfoCell/ArticleAdditionalInfoCell.vue';
import ArticleLinkInfoCell from '../components/cells/articleLinkInfoCell/ArticleLinkInfoCell.vue';
import ArticleTypeCell from '../components/cells/articleTypeCell/ArticleTypeCell.vue';
import CustomDataArrayCell from '../components/cells/customDataArrayCell/CustomDataArrayCell.vue';
import DateCell from '../components/cells/dateCell/DateCell.vue';
import DictionaryCell from '../components/cells/dictionaryCell/DictionaryCell.vue';
import EditAccommodationBookingCell from '../components/cells/editAccommodationBookingCell/EditAccommodationBookingCell.vue';
import EditAccommodationFeatureCell from '../components/cells/editAccommodationFeatureCell/EditAccommodationFeatureCell.vue';
import EditAccommodationRoomCell from '../components/cells/editAccommodationRoomCell/EditAccommodationRoomCell.vue';
import EditedDateCell from '../components/cells/editedDateCell/EditedDateCell.vue';
import EditEventDateCell from '../components/cells/editEventDateCell/EditEventDateCell.vue';
import EditEventPublisherCell from '../components/cells/editEventPublisherCell/EditEventPublisherCell.vue';
import EditEventUrlCell from '../components/cells/editEventUrlCell/EditEventUrlCell.vue';
import EditEventVariantCell from '../components/cells/editEventVariantCell/EditEventVariantCell.vue';
import EditGpsInfoCell from '../components/cells/editGpsInfoCell/EditGpsInfoCell.vue';
import GpsPointMap from '../components/cells/editGpsInfoCell/GpsPointMap.vue';
import EditGpsTrackCell from '../components/cells/editGpsTrackCell/EditGpsTrackCell.vue';
import EditImageGalleryCell from '../components/cells/editImageGalleryCell/EditImageGalleryCell.vue';
import EditRoomBookedCell from '../components/cells/editRoomBookedCell/EditRoomBookedCell.vue';
import EditRoomVenueCell from '../components/cells/editRoomVenueCell/EditRoomVenueCell.vue';
import EditVideoItemsCell from '../components/cells/editVideoItemsCell/EditVideoItemsCell.vue';
import EventDocumentCell from '../components/cells/eventDocumentCell/EventDocumentCell.vue';
import GpsPointsCell from '../components/cells/gpsPointsCell/GpsPointsCell.vue';
import HtmlCell from '../components/cells/htmlCell/HtmlCell.vue';
import ImageCell from '../components/cells/imageCell/ImageCell.vue';
import ImageEditCell from '../components/cells/imageCell/ImageEditCell.vue';
import ImageGalleryCell from '../components/cells/imageGalleryCell/ImageGalleryCell.vue';
import InputReferenceCell from '../components/cells/inputReferenceCell/InputReferenceCell.vue';
import JsonCell from '../components/cells/jsonCell/JsonCell.vue';
import LoadingCell from '../components/cells/loadingCell/LoadingCell.vue';
import MappingCell from '../components/cells/mappingCell/MappingCell.vue';
import MeasurementsCell from '../components/cells/measurementsCell/MeasurementsCell.vue';
import OperationScheduleCell from '../components/cells/operationScheduleCell/OperationScheduleCell.vue';
import PushConfigCell from '../components/cells/pushConfigCell/PushConfigCell.vue';
import PushDataCell from '../components/cells/pushDataCell/PushDataCell.vue';
import RelatedContentCell from '../components/cells/relatedContentCell/RelatedContentCell.vue';
import SelectWithOptionsCell from '../components/cells/selectWithOptionsCell/SelectWithOptionsCell.vue';
import StateCell from '../components/cells/stateCell/StateCell.vue';
import StringCell from '../components/cells/stringCell/StringCell.vue';
import StringTemplateCell from '../components/cells/stringTemplateCell/StringTemplateCell.vue';
import SyncDataConfigCell from '../components/cells/syncDataConfigCell/SyncDataConfigCell.vue';
import TagReferenceCell from '../components/cells/tagReferenceCell/TagReferenceCell.vue';
import TextAreaCell from '../components/cells/textAreaCell/TextAreaCell.vue';
import ToggleButtonCell from '../components/cells/toggleCell/ToggleButtonCell.vue';
import ToggleCell from '../components/cells/toggleCell/ToggleCell.vue';
import ToggleTriStateCell from '../components/cells/toggleCell/ToggleTriStateCell.vue';
import TypeBasedCell from '../components/cells/typeBasedCell/TypeBasedCell.vue';
import UpdateHistoryCell from '../components/cells/updateHistoryCell/UpdateHistoryCell.vue';
import UrlCell from '../components/cells/UrlCell/UrlCell.vue';
import WebcamCell from '../components/cells/webcamCell/WebcamCell.vue';

import { CellComponent } from '../types';
import { RegisteredComponent } from './types';

export const registeredComponents: readonly RegisteredComponent[] = [
  [
    CellComponent.AdditionalPropertiesCell,
    AdditionalPropertiesCell,
    { supportsTableView: true },
  ],
  [CellComponent.ArrayCell, ArrayCell, { supportsTableView: true }],
  [
    CellComponent.ArrayEditableCell,
    ArrayEditableCell,
    { supportsTableView: false },
  ],
  [CellComponent.ArrayLookupCell, ArrayLookupCell, { supportsTableView: true }],
  [CellComponent.ArrayTagsCell, ArrayTagsCell, { supportsTableView: true }],
  [
    CellComponent.ArticleAdditionalInfoCell,
    ArticleAdditionalInfoCell,
    { supportsTableView: true },
  ],
  [
    CellComponent.ArticleLinkInfoCell,
    ArticleLinkInfoCell,
    { supportsTableView: true },
  ],
  [CellComponent.ArticleTypeCell, ArticleTypeCell, { supportsTableView: true }],
  [
    CellComponent.EditAccommodationBookingCell,
    EditAccommodationBookingCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditAccommodationFeatureCell,
    EditAccommodationFeatureCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditAccommodationRoomCell,
    EditAccommodationRoomCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditGpsTrackCell,
    EditGpsTrackCell,
    { supportsTableView: false },
  ],
  [CellComponent.DateCell, DateCell, { supportsTableView: true }],
  [
    CellComponent.CustomDataArrayCell,
    CustomDataArrayCell,
    { supportsTableView: false },
  ],
  [CellComponent.DictionaryCell, DictionaryCell, { supportsTableView: true }],
  [CellComponent.EditedDateCell, EditedDateCell, { supportsTableView: true }],
  [
    CellComponent.EditImageGalleryCell,
    EditImageGalleryCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditGpsInfoCell,
    EditGpsInfoCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditRoomBookedCell,
    EditRoomBookedCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditRoomVenueCell,
    EditRoomVenueCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditVideoItemsCell,
    EditVideoItemsCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditEventPublisherCell,
    EditEventPublisherCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditEventUrlCell,
    EditEventUrlCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditEventDateCell,
    EditEventDateCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EditEventVariantCell,
    EditEventVariantCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.EventDocumentCell,
    EventDocumentCell,
    { supportsTableView: false },
  ],
  [CellComponent.GpsPointMap, GpsPointMap, { supportsTableView: true }],
  [CellComponent.GpsPointsCell, GpsPointsCell, { supportsTableView: true }],
  [CellComponent.HtmlCell, HtmlCell, { supportsTableView: true }],
  [
    CellComponent.InputReferenceCell,
    InputReferenceCell,
    { supportsTableView: true },
  ],
  [CellComponent.ImageCell, ImageCell, { supportsTableView: true }],
  [CellComponent.ImageEditCell, ImageEditCell, { supportsTableView: true }],
  [
    CellComponent.ImageGalleryCell,
    ImageGalleryCell,
    { supportsTableView: false },
  ],
  [CellComponent.JsonCell, JsonCell, { supportsTableView: true }],
  [CellComponent.LoadingCell, LoadingCell, { supportsTableView: false }],
  [CellComponent.MappingCell, MappingCell, { supportsTableView: true }],
  [
    CellComponent.MeasurementsCell,
    MeasurementsCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.OperationScheduleCell,
    OperationScheduleCell,
    { supportsTableView: false },
  ],
  [CellComponent.PushDataCell, PushDataCell, { supportsTableView: true }],
  [
    CellComponent.SelectWithOptionsCell,
    SelectWithOptionsCell,
    { supportsTableView: true },
  ],
  [CellComponent.StateCell, StateCell, { supportsTableView: true }],
  [CellComponent.StringCell, StringCell, { supportsTableView: true }],
  [CellComponent.UrlCell, UrlCell, { supportsTableView: true }],
  [
    CellComponent.StringTemplateCell,
    StringTemplateCell,
    { supportsTableView: true },
  ],
  [
    CellComponent.TagReferenceCell,
    TagReferenceCell,
    { supportsTableView: false },
  ],
  [CellComponent.TextAreaCell, TextAreaCell, { supportsTableView: true }],
  [
    CellComponent.ToggleButtonCell,
    ToggleButtonCell,
    { supportsTableView: false },
  ],
  [CellComponent.ToggleCell, ToggleCell, { supportsTableView: true }],
  [
    CellComponent.ToggleTriStateCell,
    ToggleTriStateCell,
    { supportsTableView: true },
  ],
  [CellComponent.TypeBasedCell, TypeBasedCell, { supportsTableView: true }],
  [CellComponent.WebcamCell, WebcamCell, { supportsTableView: false }],
  [
    CellComponent.RelatedContentCell,
    RelatedContentCell,
    { supportsTableView: false },
  ],
  [CellComponent.PushConfigCell, PushConfigCell, { supportsTableView: false }],
  [
    CellComponent.SyncDataConfigCell,
    SyncDataConfigCell,
    { supportsTableView: false },
  ],
  [
    CellComponent.UpdateHistoryCell,
    UpdateHistoryCell,
    { supportsTableView: true },
  ],
];

export default {
  install: (app: App) => {
    registeredComponents.forEach(([key, component]) =>
      app.component(key, component)
    );
  },
};
