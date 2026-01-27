// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '@/domain/datasets/config/types';
import {
  idReadOnlyCell,
  shortnameCell,
  imageGalleryCategory,
  licenseInfoCategory,
} from '../../builder/tourism';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { withOdhBaseUrl } from '../../utils';

export const metaDataSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell({ required: true }),
            {
              title: 'Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'ApiDescription.{language}' },
            },
            {
              title: 'Meta Title',
              component: CellComponent.StringCell,
              objectMapping: { text: 'MetaTitle.{language}' },
            },
            {
              title: 'Meta Description',
              component: CellComponent.StringCell,
              objectMapping: { text: 'MetaDescription.{language}' },
            },
            {
              title: 'Dataspace',
              component: CellComponent.SelectWithOptionsCell,
              class: 'w-60',
              objectMapping: {
                value: 'Dataspace',
              },
              params: {
                showAddNewValue: 'true',
                showValueAsLabelFallback: 'true',
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=Dataspace.[*]&rawsort=Dataspace.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Data Provider',
              component: CellComponent.CustomDataArrayCell,
              arrayMapping: {
                targetPropertyName: 'listItems',
                pathToParent: 'DataProvider',
              },
              params: {
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=DataProvider.[*]&rawsort=DataProvider.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Licenses used',
              component: CellComponent.CustomDataArrayCell,
              arrayMapping: {
                targetPropertyName: 'listItems',
                pathToParent: 'DatasetLicenses',
              },
              params: {
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=DatasetLicenses.[*]&rawsort=DatasetLicenses.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Deprecated',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Deprecated' },
            },
          ],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        {
          name: 'Count',
          properties: [
            {
              title: 'Count',
              component: CellComponent.JsonCell,
              objectMapping: { data: 'RecordCount' },
              params: { usePreformatted: 'true' },
            },
          ],
        },
      ],
    },
    {
      name: 'Api data',
      slug: 'api-data',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: 'Base URL',
              component: CellComponent.SelectWithOptionsCell,
              objectMapping: { value: 'BaseUrl' },
              params: {
                showAddNewValue: 'true',
                showValueAsLabelFallback: 'true',
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=BaseUrl.[*]&rawsort=BaseUrl.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Path',
              component: CellComponent.ArrayEditableCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'PathParam',
              },
              required: true,
            },
            {
              title: 'Filter',
              component: CellComponent.ArrayEditableCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'ApiFilter',
              },
            },
            {
              title: 'API URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'ApiUrl' },
              params: { readonly: 'true' },
            },
            {
              title: 'Api Type',
              component: CellComponent.SelectWithOptionsCell,
              class: 'w-60',
              objectMapping: {
                value: 'ApiType',
              },
              params: {
                showAddNewValue: 'true',
                showValueAsLabelFallback: 'true',
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=ApiType.[*]&rawsort=ApiType.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Output',
              component: CellComponent.DictionaryCell,
              objectMapping: {
                dictitems: 'Output',
              },
            },
            {
              title: 'Swagger URL',
              component: CellComponent.UrlCell,
              objectMapping: { text: 'SwaggerUrl' },
            },
            {
              title: 'Type',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Type' },
            },
          ],
        },
      ],
    },
    {
      name: 'Additional data',
      slug: 'additional-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            {
              title: 'Category',
              component: CellComponent.CustomDataArrayCell,
              arrayMapping: {
                targetPropertyName: 'listItems',
                pathToParent: 'Category',
              },
              params: {
                url: withOdhBaseUrl(
                  '/v1/Distinct?odhtype=odhmetadata&fields=Category.[*]&rawsort=Category.[*]&getasarray=true'
                ),
              },
            },
            {
              title: 'Tags',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'TagIds',
              },
              params: {
                keySelector: 'Id',
                labelSelector: 'TagName.{language}',
                url: withOdhBaseUrl('/v1/Tag'),
                showAdditionalData: 'true',
              },
            },
          ],
        },
        {
          name: 'Coordinate Source Configuration',
          properties: [
            {
              title: 'Coordinate Source Type',
              component: CellComponent.SelectWithOptionsCell,
              objectMapping: { value: 'CoordinateSource.Type' },
              params: {
                showValueAsLabelFallback: 'true',
                value: 'GpsInfo',
                value_001: 'Geo',
                label_001: 'Geo',
                value_002: 'GeoShapeReference',
                label_002: 'GeoShape Reference',
                value_003: 'GpsInfo',
                label_003: 'GpsInfo',
              },
            },
            {
              title: 'Coordinate Source Field',
              component: CellComponent.StringCell,
              objectMapping: { text: 'CoordinateSource.Field' },
            },
            {
              title: 'Use default Coordinate Entry',
              component: CellComponent.ToggleCell,
              objectMapping: { enabled: 'CoordinateSource.UseDefault' },
            },
          ],
        },
      ],
    },
    imageGalleryCategory(),
    licenseInfoCategory(),
    updatehistoryCategory(),
  ],
});
