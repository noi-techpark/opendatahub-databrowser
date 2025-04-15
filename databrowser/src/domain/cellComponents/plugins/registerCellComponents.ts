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
import EditedDateCell from '../components/cells/editedDateCell/EditedDateCell.vue';
import EditImageGalleryCell from '../components/cells/editImageGalleryCell/EditImageGalleryCell.vue';
import EditGpsInfoCell from '../components/cells/editGpsInfoCell/EditGpsInfoCell.vue';
import EditRoomBookedCell from '../components/cells/editRoomBookedCell/EditRoomBookedCell.vue';
import EditRoomVenueCell from '../components/cells/editRoomVenueCell/EditRoomVenueCell.vue';
import EditVideoItemsCell from '../components/cells/editVideoItemsCell/EditVideoItemsCell.vue';
import EditEventPublisherCell from '../components/cells/editEventPublisherCell/EditEventPublisherCell.vue';
import EditEventUrlCell from '../components/cells/editEventUrlCell/EditEventUrlCell.vue';
import EditEventDateCell from '../components/cells/editEventDateCell/EditEventDateCell.vue';
import EditEventVariantCell from '../components/cells/editEventVariantCell/EditEventVariantCell.vue';
import EventDocumentCell from '../components/cells/eventDocumentCell/EventDocumentCell.vue';
import GpsPointMap from '../components/cells/editGpsInfoCell/GpsPointMap.vue';
import GpsPointsCell from '../components/cells/gpsPointsCell/GpsPointsCell.vue';
import HtmlCell from '../components/cells/htmlCell/HtmlCell.vue';
import InputReferenceCell from '../components/cells/inputReferenceCell/InputReferenceCell.vue';
import ImageCell from '../components/cells/imageCell/ImageCell.vue';
import ImageEditCell from '../components/cells/imageCell/ImageEditCell.vue';
import ImageGalleryCell from '../components/cells/imageGalleryCell/ImageGalleryCell.vue';
import OperationScheduleCell from '../components/cells/operationScheduleCell/OperationScheduleCell.vue';
import JsonCell from '../components/cells/jsonCell/JsonCell.vue';
import LoadingCell from '../components/cells/loadingCell/LoadingCell.vue';
import MappingCell from '../components/cells/mappingCell/MappingCell.vue';
import MeasurementsCell from '../components/cells/measurementsCell/MeasurementsCell.vue';
import PushDataCell from '../components/cells/pushDataCell/PushDataCell.vue';
import ReferenceCell from '../components/cells/referenceCell/ReferenceCell.vue';
import SelectWithOptionsCell from '../components/cells/selectWithOptionsCell/SelectWithOptionsCell.vue';
import StateCell from '../components/cells/stateCell/StateCell.vue';
import StringCell from '../components/cells/stringCell/StringCell.vue';
import UrlCell from '../components/cells/UrlCell/UrlCell.vue';
import StringTemplateCell from '../components/cells/stringTemplateCell/StringTemplateCell.vue';
import TagCell from '../components/cells/tagCell/TagCell.vue';
import TagReferenceCell from '../components/cells/tagReferenceCell/TagReferenceCell.vue';
import TextAreaCell from '../components/cells/textAreaCell/TextAreaCell.vue';
import TextHighlightCell from '../components/cells/textHighlightCell/TextHighlightCell.vue';
import ToggleButtonCell from '../components/cells/toggleCell/ToggleButtonCell.vue';
import ToggleCell from '../components/cells/toggleCell/ToggleCell.vue';
import ToggleTriStateCell from '../components/cells/toggleCell/ToggleTriStateCell.vue';
import TypeBasedCell from '../components/cells/typeBasedCell/TypeBasedCell.vue';
import WebcamCell from '../components/cells/webcamCell/WebcamCell.vue';
import RelatedContentCell from '../components/cells/relatedContentCell/RelatedContentCell.vue';
import PushConfigCell from '../components/cells/pushConfigCell/PushConfigCell.vue';
import SyncDataConfigCell from '../components/cells/syncDataConfigCell/SyncDataConfigCell.vue';
import UpdateHistoryCell from '../components/cells/updateHistoryCell/UpdateHistoryCell.vue';

import { CellComponent } from '../types';

export default {
  install: (app: App) => {
    app.component(
      CellComponent.AdditionalPropertiesCell,
      AdditionalPropertiesCell
    );
    app.component(CellComponent.ArrayCell, ArrayCell);
    app.component(CellComponent.ArrayEditableCell, ArrayEditableCell);
    app.component(CellComponent.ArrayLookupCell, ArrayLookupCell);
    app.component(CellComponent.ArrayTagsCell, ArrayTagsCell);
    app.component(
      CellComponent.ArticleAdditionalInfoCell,
      ArticleAdditionalInfoCell
    );
    app.component(CellComponent.ArticleLinkInfoCell, ArticleLinkInfoCell);
    app.component(CellComponent.ArticleTypeCell, ArticleTypeCell);
    app.component(CellComponent.DateCell, DateCell);
    app.component(CellComponent.CustomDataArrayCell, CustomDataArrayCell);
    app.component(CellComponent.DictionaryCell, DictionaryCell);
    app.component(CellComponent.EditedDateCell, EditedDateCell);
    app.component(CellComponent.EditImageGalleryCell, EditImageGalleryCell);
    app.component(CellComponent.EditGpsInfoCell, EditGpsInfoCell);
    app.component(CellComponent.EditRoomBookedCell, EditRoomBookedCell);
    app.component(CellComponent.EditRoomVenueCell, EditRoomVenueCell);
    app.component(CellComponent.EditVideoItemsCell, EditVideoItemsCell);
    app.component(CellComponent.EditEventPublisherCell, EditEventPublisherCell);
    app.component(CellComponent.EditEventUrlCell, EditEventUrlCell);
    app.component(CellComponent.EditEventDateCell, EditEventDateCell);
    app.component(CellComponent.EditEventVariantCell, EditEventVariantCell);
    app.component(CellComponent.EventDocumentCell, EventDocumentCell);
    app.component(CellComponent.GpsPointMap, GpsPointMap);
    app.component(CellComponent.GpsPointsCell, GpsPointsCell);
    app.component(CellComponent.HtmlCell, HtmlCell);
    app.component(CellComponent.InputReferenceCell, InputReferenceCell);
    app.component(CellComponent.ImageCell, ImageCell);
    app.component(CellComponent.ImageEditCell, ImageEditCell);
    app.component(CellComponent.ImageGalleryCell, ImageGalleryCell);
    app.component(CellComponent.JsonCell, JsonCell);
    app.component(CellComponent.LoadingCell, LoadingCell);
    app.component(CellComponent.MappingCell, MappingCell);
    app.component(CellComponent.MeasurementsCell, MeasurementsCell);
    app.component(CellComponent.OperationScheduleCell, OperationScheduleCell);
    app.component(CellComponent.PushDataCell, PushDataCell);
    app.component(CellComponent.ReferenceCell, ReferenceCell);
    app.component(CellComponent.SelectWithOptionsCell, SelectWithOptionsCell);
    app.component(CellComponent.StateCell, StateCell);
    app.component(CellComponent.StringCell, StringCell);
    app.component(CellComponent.UrlCell, UrlCell);
    app.component(CellComponent.StringTemplateCell, StringTemplateCell);
    app.component(CellComponent.TagCell, TagCell);
    app.component(CellComponent.TagReferenceCell, TagReferenceCell);
    app.component(CellComponent.TextAreaCell, TextAreaCell);
    app.component(CellComponent.TextHighlightCell, TextHighlightCell);
    app.component(CellComponent.ToggleButtonCell, ToggleButtonCell);
    app.component(CellComponent.ToggleCell, ToggleCell);
    app.component(CellComponent.ToggleTriStateCell, ToggleTriStateCell);
    app.component(CellComponent.TypeBasedCell, TypeBasedCell);
    app.component(CellComponent.WebcamCell, WebcamCell);
    app.component(CellComponent.RelatedContentCell, RelatedContentCell);
    app.component(CellComponent.PushConfigCell, PushConfigCell);
    app.component(CellComponent.SyncDataConfigCell, SyncDataConfigCell);
    app.component(CellComponent.UpdateHistoryCell, UpdateHistoryCell);
  },
};
