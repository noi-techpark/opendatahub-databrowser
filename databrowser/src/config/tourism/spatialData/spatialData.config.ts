// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { spatialDataDescription } from './spatialData.description';
import { spatialDataOperations } from './spatialData.operations';
import { spatialDataViews } from './spatialData.views';
import { spatialDataRoute } from './spatialData.route';

export const spatialDataConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.tourism.baseUrl,
  route: spatialDataRoute,
  description: spatialDataDescription,
  views: spatialDataViews,
  operations: spatialDataOperations,
};
