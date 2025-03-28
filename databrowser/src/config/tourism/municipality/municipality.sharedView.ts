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
  mainImageCell,
  odhTagCategory,
  regionIdCell,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  webcamCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';

export const municipalitySharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell(), mainImageCell()],
        },
        {
          name: 'Municipality Details',
          properties: [
            {
              title: 'CAP',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'Plz',
              },
            },
            {
              title: 'Inhabitants',
              component: CellComponent.StringCell,
              objectMapping: {
                text: 'Inhabitants',
              },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [
            ...idAndCustomIdCells(),
            {
              title: 'Siag Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'SiagId' },
              class: 'break-all',
            },
            {
              title: 'Tourismverein Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'TourismvereinId' },
              class: 'break-all',
            },
            {
              title: 'Istat Number',
              component: CellComponent.StringCell,
              objectMapping: { text: 'IstatNumber' },
              class: 'break-all',
            },
            regionIdCell('RegionId'),
            {
              title: 'HGV id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Mapping.hgv.id' },
              class: 'break-all',
            },
          ],
        },
        dataStatesSubCategory({ hasVisibleInSearch: true }),
        sourceSubCategoryWithDistinct('municipality'),
      ],
    },
    textInfoCategory(),
    imageGalleryCategory(),
    contactCategory(),
    gpsDataCategory(),
    webcamCategory(),
    odhTagCategory(),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
