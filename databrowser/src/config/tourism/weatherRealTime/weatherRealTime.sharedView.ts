// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';

export const weatherRealTimeSharedView = ():
  | DetailViewConfig
  | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Name',
              component: CellComponent.StringCell,
              objectMapping: { text: 'name' },
            },
            {
              title: 'Category Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'categoryId' },
            },
            {
              title: 'ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'id' },
              params: { readonly: 'true' },
            },
          ],
        },
      ],
    },
    {
      name: 'GPS Data',
      slug: 'gps-data',
      subcategories: [
        {
          name: 'GPS Data',
          properties: [
            {
              title: '',
              component: CellComponent.GpsPointWithMapCell,
              objectMapping: {
                altitude: 'altitude',
                latitude: 'latitude',
                longitude: 'longitude',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Measurements',
      slug: 'measurements',
      subcategories: [
        {
          name: 'Measurements',
          properties: [
            {
              title: 'Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'measurements.0.description' },
            },
            {
              title: 'Image',
              component: CellComponent.ImageEditCell,
              objectMapping: { src: 'measurements.0.imageUrl' },
            },
            {
              title: 'code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'measurements.0.code' },
            },
          ],
        },
      ],
    },
    {
      name: 'Others',
      slug: 'others',
      subcategories: [
        {
          name: 'Others',
          properties: [
            {
              title: 'code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'code' },
            },
            {
              title: 'wind direction | dd',
              component: CellComponent.StringCell,
              objectMapping: { text: 'dd' },
            },
            {
              title: 'wind intensity (km) | ff',
              component: CellComponent.StringCell,
              objectMapping: { text: 'ff' },
            },
            {
              title: 'snow depth (cm) | hs',
              component: CellComponent.StringCell,
              objectMapping: { text: 'hs' },
            },
            {
              title: 'lwdType',
              component: CellComponent.StringCell,
              objectMapping: { text: 'lwdType' },
            },
            {
              title: 'precipitation (mm) | n',
              component: CellComponent.StringCell,
              objectMapping: { text: 'n' },
            },
            {
              title: 'air pressure (hPa) | p',
              component: CellComponent.StringCell,
              objectMapping: { text: 'p' },
            },
            {
              title: 'flow rate (m³/s) | q',
              component: CellComponent.StringCell,
              objectMapping: { text: 'q' },
            },
            {
              title: 'relative humidity (%) | rh',
              component: CellComponent.StringCell,
              objectMapping: { text: 'rh' },
            },
            {
              title: 'air temperature (°C) | t',
              component: CellComponent.StringCell,
              objectMapping: { text: 't' },
            },
            {
              title: 'VAX Code',
              component: CellComponent.StringCell,
              objectMapping: { text: 'vaxcode' },
            },
            {
              title: 'water level (cm) | w',
              component: CellComponent.StringCell,
              objectMapping: { text: 'w' },
            },
            {
              title: 'max wind speed (km/h) |wMax',
              component: CellComponent.StringCell,
              objectMapping: { text: 'wMax' },
            },
            {
              title: 'sunshine duration (hh:min) | sd',
              component: CellComponent.StringCell,
              objectMapping: { text: 'sd' },
            },
            {
              title: 'global radiation (W/m²) | gs',
              component: CellComponent.StringCell,
              objectMapping: { text: 'gs' },
            },
            {
              title: 'water temperature (°C) | wt',
              component: CellComponent.StringCell,
              objectMapping: { text: 'wt' },
            },
            {
              title: 'visibility',
              component: CellComponent.StringCell,
              objectMapping: { text: 'visibility' },
            },
            {
              title: 'Zoom Level',
              component: CellComponent.StringCell,
              objectMapping: { text: 'zoomLevel' },
            },
          ],
        },
      ],
    },
  ],
});
