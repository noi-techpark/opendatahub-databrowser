// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  contactCategory,
  dataStatesSubCategory,
  gpsDataCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  odhTagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { videoItemsCategory } from '../../builder/tourism/video';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const webcamInfoSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell()],
        },
        {
          name: 'IDs',
          properties: [
            idReadOnlyCell(),
            {
              title: 'Area Ids',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'AreaIds',
              },
              params: {
                separator: ', ',
              },
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('webcam'),
      ],
    },
    gpsDataCategory(),
    odhTagCategory(),
    {
      name: 'Webcam Details',
      slug: 'Webcam Details',
      subcategories: [
        {
          name: 'Webcam Details',
          properties: [
            {
              title: 'Image URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'WebCamProperties.WebcamUrl' },
            },
            {
              title: 'Stream URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'WebCamProperties.StreamUrl' },
            },
            {
              title: 'Preview URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'WebCamProperties.PreviewUrl' },
            },
          ],
        },
      ],
    },
    imageGalleryCategory({ resizeImages: false }),
    videoItemsCategory(),
    textInfoCategory(),
    contactCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
