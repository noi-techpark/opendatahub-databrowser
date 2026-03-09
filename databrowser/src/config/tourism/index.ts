// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../domain/datasets/config/types';
import {
  defaultTourismSingleRecordQueryParameters,
  defaultTourismTableQueryParameters,
} from '../../domain/datasets/ui/tableView/defaultValues';
import { accommodationConfig } from './accommodation/accommodation.config';
import { accommodationRoomsConfig } from './accommodationRooms/accommodationRooms.config';
import { accommodationTypesConfig } from './accommodationTypes/accommodationTypes.config';
import { articleConfig } from './article/article.config';
import { districtConfig } from './district/district.config';
import { eventConfig } from './event/event.config';
import { eventv2Config } from './eventv2/eventv2.config';
import { eventShortConfig } from './eventShort/eventShort.config';
import { eventTopicsConfig } from './eventTopics/eventTopics.config';
import { experienceAreaConfig } from './experienceArea/experienceArea.config';
import { weatherForecastConfig } from './weatherForecast/weatherForecast.config';
import { gastronomyConfig } from './gastronomy/gastronomy.config';
import { measuringPointConfig } from './measuringPoint/measuringPoint.config';
import { metaDataConfig } from './metaData/metaData.config';
import { metaRegionConfig } from './metaRegion/metaRegion.config';
import { municipalityConfig } from './municipality/municipality.config';
import { odhActivityPoiConfig } from './odhActivityPoi/odhActivityPoi.config';
import { odhActivityPoiTypesConfig } from './odhActivityPoiTypes/odhActivityPoiTypes.config';
import { odhTagConfig } from './odhTag/odhTag.config';
import { tagConfig } from './tag/tag.config';
import { publishedOnConfig } from './publishedOn/publishedOn.config';
import { pushResponseConfig } from './pushResponse/pushResponse.config';
import { regionConfig } from './region/region.config';
import { skiAreaConfig } from './skiArea/skiArea.config';
import { skiRegionConfig } from './skiRegion/skiRegion.config';
import { snowReportConfig } from './snowReport/snowReport.config';
import { sourceConfig } from './source/source.config';
import { tourismAssociationConfig } from './tourismAssociation/tourismAssociation.config';
import { venueConfig } from './venue/venue.config';
import { venuev2Config } from './venuev2/venuev2.config';
import { weatherConfig } from './weather/weather.config';
import { weatherDistrictConfig } from './weatherDistrict/weatherDistrict.config';
import { weatherInfoConfig } from './weatherInfo/weatherInfo.config';
import { weatherRealTimeConfig } from './weatherRealTime/weatherRealTime.config';
import { webcamInfoConfig } from './webcamInfo/webcamInfo.config';
import { wineAwardConfig } from './wineAward/wineAward.config';
import { announcementConfig } from './announcement/announcement.config';
import { tripConfig } from './trip/trip.config';

export const tourismEmbeddedDatasetConfigs = [
  accommodationConfig,
  accommodationRoomsConfig,
  announcementConfig,
  articleConfig,
  eventShortConfig,
  odhActivityPoiConfig,
  odhActivityPoiTypesConfig,
  eventTopicsConfig,
  accommodationTypesConfig,
  webcamInfoConfig,
  wineAwardConfig,
  weatherForecastConfig,
  gastronomyConfig,
  venueConfig,
  venuev2Config,
  weatherInfoConfig,
  municipalityConfig,
  districtConfig,
  regionConfig,
  metaRegionConfig,
  tourismAssociationConfig,
  tripConfig,
  skiRegionConfig,
  skiAreaConfig,
  sourceConfig,
  weatherConfig,
  weatherDistrictConfig,
  weatherRealTimeConfig,
  measuringPointConfig,
  snowReportConfig,
  eventConfig,
  eventv2Config,
  experienceAreaConfig,
  metaDataConfig,
  publishedOnConfig,
  pushResponseConfig,
  odhTagConfig,
  tagConfig,
].map<DatasetConfig>((config) => ({
  ...config,
  views: {
    ...config.views,
    table:
      config.views?.table == null
        ? undefined
        : {
            ...config.views?.table,
            defaultQueryParams: defaultTourismTableQueryParameters,
          },
    detail:
      config.views?.detail == null
        ? undefined
        : {
            ...config.views?.detail,
            defaultQueryParams: defaultTourismSingleRecordQueryParameters,
          },
    edit:
      config.views?.edit == null
        ? undefined
        : {
            ...config.views?.edit,
            defaultQueryParams: defaultTourismSingleRecordQueryParameters,
          },
    raw:
      config.views?.raw == null
        ? undefined
        : {
            ...config.views?.raw,
            defaultQueryParams: defaultTourismSingleRecordQueryParameters,
          },
    new:
      config.views?.edit == null
        ? undefined
        : {
            ...config.views?.edit,
            defaultQueryParams: defaultTourismSingleRecordQueryParameters,
          },
  },
}));
