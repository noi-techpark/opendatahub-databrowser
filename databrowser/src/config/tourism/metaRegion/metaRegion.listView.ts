// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  imageTableCell,
  languageTableCell,
  lastChangesTableCell,
  publishedOnTableCell,
  pushDataTableCell,
  sourceTableCell,
  titleTableCell,
} from '../../builder/tourism';
import { geoDataTableCell } from '../../builder/tourism/geoData';

export const metaRegionListView: ListViewConfig = {
  elements: [
    titleTableCell(),
    imageTableCell(),
    geoDataTableCell(),
    languageTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    publishedOnTableCell(),
    pushDataTableCell(),
  ],
};
