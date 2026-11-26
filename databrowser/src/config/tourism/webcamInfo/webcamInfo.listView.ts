// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { ListViewConfig } from '../../../domain/datasets/config/types';
import {
  gpsMapTableCell,
  imageTableCell,
  lastChangesTableCell,
  sourceTableCell,
  publishedOnTableCell,
  pushDataTableCell,
  lastSyncTableCell,
} from '../../builder/tourism';

export const webcamInfoListView: ListViewConfig = {
  elements: [
    {
      title: 'Webcam Name',
      component: CellComponent.StringCell,
      class: 'w-40',
      objectMapping: {
        text: 'Webcamname.{language}',
      },
    },
    imageTableCell(),
    {
      title: 'Webcam URL',
      component: CellComponent.UrlCell,
      class: 'w-40',
      objectMapping: {
        text: 'WebCamProperties.WebcamUrl',
      },
    },
    gpsMapTableCell(),
    lastChangesTableCell(),
    sourceTableCell(),
    publishedOnTableCell(),
    pushDataTableCell(),
    lastSyncTableCell(true, 'Detail.{language}.Title'),
  ],
};
