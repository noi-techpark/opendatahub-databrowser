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
import ReferenceCell from '../components/cells/referenceCell/ReferenceCell.vue';
import RelatedContentCell from '../components/cells/relatedContentCell/RelatedContentCell.vue';
import SelectWithOptionsCell from '../components/cells/selectWithOptionsCell/SelectWithOptionsCell.vue';
import StateCell from '../components/cells/stateCell/StateCell.vue';
import StringCell from '../components/cells/stringCell/StringCell.vue';
import StringTemplateCell from '../components/cells/stringTemplateCell/StringTemplateCell.vue';
import SyncDataConfigCell from '../components/cells/syncDataConfigCell/SyncDataConfigCell.vue';
import TagCell from '../components/cells/tagCell/TagCell.vue';
import TagReferenceCell from '../components/cells/tagReferenceCell/TagReferenceCell.vue';
import TextAreaCell from '../components/cells/textAreaCell/TextAreaCell.vue';
import TextHighlightCell from '../components/cells/textHighlightCell/TextHighlightCell.vue';
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
  [CellComponent.AdditionalPropertiesCell, AdditionalPropertiesCell],
  [CellComponent.ArrayCell, ArrayCell],
  [CellComponent.ArrayEditableCell, ArrayEditableCell],
  [CellComponent.ArrayLookupCell, ArrayLookupCell],
  [CellComponent.ArrayTagsCell, ArrayTagsCell],
  [CellComponent.ArticleAdditionalInfoCell, ArticleAdditionalInfoCell],
  [CellComponent.ArticleLinkInfoCell, ArticleLinkInfoCell],
  [CellComponent.ArticleTypeCell, ArticleTypeCell],
  [CellComponent.EditAccommodationBookingCell, EditAccommodationBookingCell],
  [CellComponent.EditAccommodationFeatureCell, EditAccommodationFeatureCell],
  [CellComponent.EditAccommodationRoomCell, EditAccommodationRoomCell],
  [CellComponent.EditGpsTrackCell, EditGpsTrackCell],
  [CellComponent.DateCell, DateCell],
  [CellComponent.CustomDataArrayCell, CustomDataArrayCell],
  [CellComponent.DictionaryCell, DictionaryCell],
  [CellComponent.EditedDateCell, EditedDateCell],
  [CellComponent.EditImageGalleryCell, EditImageGalleryCell],
  [CellComponent.EditGpsInfoCell, EditGpsInfoCell],
  [CellComponent.EditRoomBookedCell, EditRoomBookedCell],
  [CellComponent.EditRoomVenueCell, EditRoomVenueCell],
  [CellComponent.EditVideoItemsCell, EditVideoItemsCell],
  [CellComponent.EditEventPublisherCell, EditEventPublisherCell],
  [CellComponent.EditEventUrlCell, EditEventUrlCell],
  [CellComponent.EditEventDateCell, EditEventDateCell],
  [CellComponent.EditEventVariantCell, EditEventVariantCell],
  [CellComponent.EventDocumentCell, EventDocumentCell],
  [CellComponent.GpsPointMap, GpsPointMap],
  [CellComponent.GpsPointsCell, GpsPointsCell],
  [CellComponent.HtmlCell, HtmlCell],
  [CellComponent.InputReferenceCell, InputReferenceCell],
  [CellComponent.ImageCell, ImageCell],
  [CellComponent.ImageEditCell, ImageEditCell],
  [CellComponent.ImageGalleryCell, ImageGalleryCell],
  [CellComponent.JsonCell, JsonCell],
  [CellComponent.LoadingCell, LoadingCell],
  [CellComponent.MappingCell, MappingCell],
  [CellComponent.MeasurementsCell, MeasurementsCell],
  [CellComponent.OperationScheduleCell, OperationScheduleCell],
  [CellComponent.PushDataCell, PushDataCell],
  [CellComponent.ReferenceCell, ReferenceCell],
  [CellComponent.SelectWithOptionsCell, SelectWithOptionsCell],
  [CellComponent.StateCell, StateCell],
  [CellComponent.StringCell, StringCell],
  [CellComponent.UrlCell, UrlCell],
  [CellComponent.StringTemplateCell, StringTemplateCell],
  [CellComponent.TagCell, TagCell],
  [CellComponent.TagReferenceCell, TagReferenceCell],
  [CellComponent.TextAreaCell, TextAreaCell],
  [CellComponent.TextHighlightCell, TextHighlightCell],
  [CellComponent.ToggleButtonCell, ToggleButtonCell],
  [CellComponent.ToggleCell, ToggleCell],
  [CellComponent.ToggleTriStateCell, ToggleTriStateCell],
  [CellComponent.TypeBasedCell, TypeBasedCell],
  [CellComponent.WebcamCell, WebcamCell],
  [CellComponent.RelatedContentCell, RelatedContentCell],
  [CellComponent.PushConfigCell, PushConfigCell],
  [CellComponent.SyncDataConfigCell, SyncDataConfigCell],
  [CellComponent.UpdateHistoryCell, UpdateHistoryCell],
];

export default {
  install: (app: App) => {
    registeredComponents.forEach(([key, component]) =>
      app.component(key, component)
    );
  },
};
