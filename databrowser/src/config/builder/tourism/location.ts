// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { DetailElements, PropertyConfig } from '@/domain/datasets/config/types';
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

interface LocationTableCellsAllOptions {
  showRegion?: boolean;
  showTourismAssociation?: boolean;
  showMunicipality?: boolean;
  showDistrict?: boolean;
}

export const locationTableCellsAll = ({
  showRegion = true,
  showTourismAssociation = true,
  showMunicipality = true,
  showDistrict = true,
}: LocationTableCellsAllOptions = {}): PropertyConfig[] =>
  [
    showRegion && {
      title: 'Region',
      component: CellComponent.StringCell,
      class: 'w-52',
      objectMapping: { text: 'LocationInfo.RegionInfo.Name.{language}' },
    },
    showTourismAssociation && {
      title: 'TourismAssociation',
      component: CellComponent.StringCell,
      class: 'w-52',
      objectMapping: { text: 'LocationInfo.TvInfo.Name.{language}' },
    },
    showMunicipality && {
      title: 'Municipality',
      component: CellComponent.StringCell,
      class: 'w-52',
      objectMapping: { text: 'LocationInfo.MunicipalityInfo.Name.{language}' },
    },
    showDistrict && {
      title: 'District',
      component: CellComponent.StringCell,
      class: 'w-52',
      objectMapping: { text: 'LocationInfo.DistrictInfo.Name.{language}' },
    },
  ].filter(Boolean) as PropertyConfig[];

interface LocationTableCellsMergedOptions {
  showRegion?: boolean;
  showTourismAssociation?: boolean;
  showMunicipality?: boolean;
  showDistrict?: boolean;
  separator?: string;
}

export const locationTableCellsMerged = ({
  showRegion = true,
  showTourismAssociation = false,
  showMunicipality = true,
  showDistrict = false,
  separator,
}: LocationTableCellsMergedOptions = {}): PropertyConfig[] => {
  const fields: [boolean, string][] = [
    [showRegion, 'LocationInfo.RegionInfo.Name.{language}'],
    [showMunicipality, 'LocationInfo.MunicipalityInfo.Name.{language}'],
    [showTourismAssociation, 'LocationInfo.TvInfo.Name.{language}'],
    [showDistrict, 'LocationInfo.DistrictInfo.Name.{language}'],
  ];

  const enabledPaths = fields
    .filter(([show]) => show)
    .map(([, path]) => path as string);

  if (enabledPaths.length === 0) {
    return [];
  }

  const objectMapping = Object.fromEntries(
    enabledPaths.map((path, i) => [`text${i + 1}`, path])
  );

  const filterPath =
    enabledPaths.find((p) => p.includes('MunicipalityInfo')) ?? enabledPaths[0];

  return [
    {
      title: 'Location',
      component: CellComponent.ConcatCell,
      class: 'w-52',
      objectMapping,
      params: {
        filterPath,
        ...(separator != null && { separator }),
      },
    },
  ];
};

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
