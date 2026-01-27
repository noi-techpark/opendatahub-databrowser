// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { announcementDescription } from './announcement.description';
import { announcementOperations } from './announcement.operations';
import { announcementViews } from './announcement.views';
import { announcementRoute } from './announcement.route';

export const announcementConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.tourism.baseUrl,
  route: announcementRoute,
  description: announcementDescription,
  views: announcementViews,
  operations: announcementOperations,
};
