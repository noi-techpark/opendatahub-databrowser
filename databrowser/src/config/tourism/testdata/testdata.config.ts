// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetConfig } from '../../../domain/datasets/config/types';
import { domainWithOpenApiDocument } from '../../../domain/openApi';
import { testdataDescription } from './testdata.description';
import { testdataOperations } from './testdata.operations';
import { testdataViews } from './testdata.views';
import { testdataRoute } from './testdata.route';

export const testdataConfig: DatasetConfig = {
  source: 'embedded',
  baseUrl: domainWithOpenApiDocument.tourism.baseUrl,
  route: testdataRoute,
  description: testdataDescription,
  views: testdataViews,
  operations: testdataOperations,
};
