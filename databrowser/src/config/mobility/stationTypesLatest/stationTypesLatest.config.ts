// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { stationTypesLatestDescription } from './stationTypesLatest.description';
import { stationTypesLatestViews } from './stationTypesLatest.views';
import { stationTypesLatestRoute } from './stationTypesLatest.route';

export const stationTypesLatestConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.mobility.baseUrl,
  route: stationTypesLatestRoute,
  description: stationTypesLatestDescription,
  views: stationTypesLatestViews,
};
