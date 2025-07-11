// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { accommodationRoomsDescription } from './accommodationRooms.description';
import { accommodationRoomsOperations } from './accommodationRooms.operations';
import { accommodationRoomsViews } from './accommodationRooms.views';
import { accommodationRoomsRoute } from './accommodationRooms.route';

export const accommodationRoomsConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.tourism.baseUrl,
  route: accommodationRoomsRoute,
  description: accommodationRoomsDescription,
  views: accommodationRoomsViews,
  operations: accommodationRoomsOperations,
};
