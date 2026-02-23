// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { tripDescription } from './trip.description';
import { tripOperations } from './trip.operations';
import { tripViews } from './trip.views';
import { tripRoute } from './trip.route';

export const tripConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.tourism.baseUrl,
  route: tripRoute,
  description: tripDescription,
  views: tripViews,
  operations: tripOperations,
};
