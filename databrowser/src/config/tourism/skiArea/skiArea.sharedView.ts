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
  idAndCustomIdCells,
  imageGalleryCategory,
  logoWithMainImageCells,
  odhTagCategory,
  seasonCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  webcamCategory,
  locationCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const skiAreaSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell(),
            {
              title: 'Ski region name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SkiRegionName.{language}' },
            },
            ...logoWithMainImageCells(),
          ],
        },
        {
          name: 'IDs',
          properties: [
            ...idAndCustomIdCells(),
            {
              title: 'SkiRegionId',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SkiRegionId' },
              class: 'break-all',
            },
            {
              title: 'Area Ids',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'AreaId',
              },
              params: {
                separator: ', ',
              },
            },
          ],
        },
        {
          name: 'Slope information',
          properties: [
            {
              title: 'Total slope Km',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TotalSlopeKm' },
            },
            {
              title: 'Slope Km Blue',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SlopeKmBlue' },
            },
            {
              title: 'Slope Km Black',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SlopeKmBlack' },
            },
            {
              title: 'Slope Km Red',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SlopeKmRed' },
            },
          ],
        },
        {
          name: 'Altimeters',
          properties: [
            {
              title: 'Altimeters From',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeFrom' },
            },
            {
              title: 'Altimeters To',
              component: CellComponent.StringCell,
              objectMapping: { text: 'AltitudeTo' },
            },
          ],
        },
        {
          name: 'Ski map',
          properties: [
            {
              title: 'Ski map',
              component: CellComponent.ImageEditCell,
              objectMapping: {
                src: 'SkiAreaMapURL',
              },
            },
          ],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('skiarea'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    seasonCategory(),
    locationCategory(),
    gpsDataCategory(),
    webcamCategory(),
    odhTagCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
