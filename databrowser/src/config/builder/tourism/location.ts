// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

export const locationCategory = (): DetailElements => ({
  name: 'Location',
  slug: 'location',
  subcategories: [
    {
      name: 'Region',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'LocationInfo.RegionInfo.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=reg&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: 'Region ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'LocationInfo.RegionInfo.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
    {
      name: 'Tourism Association',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'LocationInfo.TvInfo.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=tvs&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: 'Tourism Association ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'LocationInfo.TvInfo.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
    {
      name: 'Municipality',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'LocationInfo.MunicipalityInfo.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=mun&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: 'Municipality ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'LocationInfo.MunicipalityInfo.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
    {
      name: 'District',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'LocationInfo.DistrictInfo.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=fra&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: 'District ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'LocationInfo.DistrictInfo.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
  ],
});

export const locationCategoryDistrict = (): DetailElements => ({
  name: 'Location',
  slug: 'location',
  subcategories: [
    {
      name: 'Region',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'Region.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=reg&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: ' Region ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Region.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
    {
      name: 'Tourism Assocciation',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'Tourismassociation.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=tvs&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
          required: true,
        },
        {
          title: 'Tourism Assocciation ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Tourismassociation.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
    {
      name: 'Municipality',
      properties: [
        {
          title: '',
          component: CellComponent.InputReferenceCell,
          objectMapping: { value: 'Municipality.Id' },
          params: {
            url: withOdhBaseUrl('/v1/Location?type=mun&showall=true'),
            labelSelector: 'name.{language}',
            keySelector: 'id',
          },
        },
        {
          title: 'Municipality ID',
          component: CellComponent.StringCell,
          objectMapping: { text: 'Municipality.Id' },
          params: { readonly: 'true' },
          class: 'break-all',
        },
      ],
    },
  ],
});

export const locationTableCellsAll = (): PropertyConfig[] => [
  {
    title: 'Region',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.RegionInfo.Name.{language}' },
  },
  {
    title: 'TourismAssociation',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.TvInfo.Name.{language}' },
  },
  {
    title: 'Municipality',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.MunicipalityInfo.Name.{language}' },
  },
  {
    title: 'District',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.DistrictInfo.Name.{language}' },
  },
];

export const locationTableCellsStandard = (): PropertyConfig[] => [
  {
    title: 'Region',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.RegionInfo.Name.{language}' },
  },
  {
    title: 'TourismAssociation',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.TvInfo.Name.{language}' },
  },
  {
    title: 'Municipality',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.MunicipalityInfo.Name.{language}' },
  },
];

export const locationTableCellsMinimal = (): PropertyConfig[] => [
  {
    title: 'Region',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.RegionInfo.Name.{language}' },
  },
  {
    title: 'Municipality',
    component: CellComponent.StringCell,
    class: 'w-52',
    objectMapping: { text: 'LocationInfo.MunicipalityInfo.Name.{language}' },
  },
];

export const locationTableCellsReferencedMinimal = (): PropertyConfig[] => [
  {
    title: 'Region',
    component: CellComponent.InputReferenceCell,
    class: 'w-52',
    objectMapping: { value: 'LocationInfo.RegionInfo.Id' },
    params: {
      url: withOdhBaseUrl('/v1/Location?type=reg&showall=true'),
      labelSelector: 'name.{language}',
      keySelector: 'id',
      showid: 'true',
    },
  },
  {
    title: 'Municipality',
    component: CellComponent.InputReferenceCell,
    class: 'w-52',
    objectMapping: { value: 'LocationInfo.MunicipalityInfo.Id' },
    params: {
      url: withOdhBaseUrl('/v1/Location?type=mun&showall=true'),
      labelSelector: 'name.{language}',
      keySelector: 'id',
      showid: 'true',
    },
  },
];
