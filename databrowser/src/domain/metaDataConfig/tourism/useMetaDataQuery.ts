// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { parse } from 'date-fns';
import { withOdhBaseUrl } from '../../../config/utils';
import { unwrapData } from '../../api/dataExtraction';
import { useApiRead } from '../../api/useApi';
import { WithTourismPagination } from '../../datasets/pagination/types';
import { ApiType } from '../types';
import { TourismMetaData } from './types';

interface ODHTag {
  Id: string;
  Self: string;
}
interface OdhTourismMetaData {
  BaseUrl: string;
  ApiFilter: string[];
  Id: string;
  OdhType?: string;
  SwaggerUrl?: string;
  Self?: string;
  ApiUrl?: string;
  Deprecated: boolean;
  SingleDataset: boolean;
  FirstImport?: string;
  LastChange?: string;
  Shortname: string;
  Sources?: string[];
  RecordCount?: { open?: number; closed?: number; reduced?: number };
  Output?: Record<string, string>;
  ApiDescription?: Record<string, string>;
  PathParam: string[];
  PublishedOn: string[];
  ApiAccess?: Record<string, string>;
  ODHTags?: ODHTag[];
  Dataspace?: string;
  Category?: string[];
  DataProvider?: string[];
  ApiType?: string;
  LicenseInfo?: {
    Author?: string;
    License?: string;
    ClosedData?: boolean;
    LicenseHolder?: string;
  };
  CoordinateSource?: {
    Type?: 'GeoData' | 'GpsInfo',
    Field?: string,
  }
}

const metaDataUrl = withOdhBaseUrl('/v1/MetaData?pagesize=1000');

export const useMetaDataQuery = () => {
  return useApiRead(metaDataUrl, {
    select,
    queryKey: [metaDataUrl],
    // Data is stale after 10 minutes
    staleTime: 10 * 60 * 1000,
  });
};

const select = (
  data: WithTourismPagination<OdhTourismMetaData[]>
): TourismMetaData[] => {
  // Unwrap data from pagination
  const unwrappedData = unwrapData<OdhTourismMetaData[]>(data);

  // Map ODH MetaData to internal format
  const itemsWithoutParentInfo = mapResponse(unwrappedData);

  // Add parent information to all sub-datasets
  return addParentInfo(itemsWithoutParentInfo);
};

const mapResponse = (datasets: OdhTourismMetaData[]): TourismMetaData[] =>
  datasets
    .map((dataset) => ({
      id: dataset.Id,
      baseUrl: dataset.BaseUrl,
      shortname: dataset.Shortname,
      description: dataset.ApiDescription?.en,
      output: Object.values(dataset.Output ?? {}).join(', '),
      swaggerUrl: dataset.SwaggerUrl,
      access: parseAccess(dataset.ApiAccess),
      pathSegments: dataset.PathParam,
      externalLink: dataset.ApiUrl,
      sources: dataset.Sources ?? [],
      lastUpdated: parseLastUpdated(dataset.LastChange),
      apiFilter: parseApiFilter(dataset.ApiFilter),
      recordCount: dataset.RecordCount as Record<string, number>,
      deprecated: dataset.Deprecated,
      parent: undefined,
      tags: dataset.ODHTags?.map((tag) => tag.Id) || [],
      dataSpace: dataset.Dataspace,
      categories: dataset.Category || [],
      dataProviders: dataset.DataProvider || [],
      singleDataset: dataset.SingleDataset,
      datasetConfigurations: [],
      apiType: parseApiType(dataset.ApiType, dataset.ApiUrl),
      licenseInfo: parseLicenseInfo(dataset.LicenseInfo),
      coordinateSource: {
        type: dataset.CoordinateSource?.Type,
        field: dataset.CoordinateSource?.Field,
      }
    }))
    .sort((a, b) => a?.shortname?.localeCompare(b?.shortname));

const addParentInfo = (datasets: TourismMetaData[]): TourismMetaData[] => {
  const buildKey = (dataset: TourismMetaData) => dataset.pathSegments.join('/');
  // Build a map of all root-datasets (i.e. not sub-datasets that have no apiFilter set).
  // The key corresponds to the path params of the dataset as string (joined by '/'), the
  // value is the dataset itself. The parent connection is then resolved by path params.
  const rootDatasets = datasets.reduce<Record<string, TourismMetaData>>(
    (prev, dataset) => {
      if (!hasApiFilter(dataset)) {
        const key = buildKey(dataset);
        return { ...prev, [key]: dataset };
      }
      return prev;
    },
    {}
  );

  // Set root-dataset as parent for all sub-datasets (a sub-dataset is a dataset that has
  // an apiFilter set)
  return datasets.map((dataset) => {
    if (!hasApiFilter(dataset)) {
      return dataset;
    }
    const key = buildKey(dataset);
    const parent = rootDatasets[key];
    return { ...dataset, parent };
  });
};

const parseAccess = (
  apiAccess?: Record<string, string>
): TourismMetaData['access'] => {
  if (apiAccess == null) {
    return 'unknown';
  }
  // apiAccess is an object with keys like "open", "closed", "reduced" and values like "open", "closed", "reduced"
  const accessTypes = new Set(Object.values(apiAccess));
  if (accessTypes.has('closed')) {
    return 'closed';
  }
  if (accessTypes.has('reduced')) {
    return 'limited';
  }
  if (accessTypes.has('open')) {
    return 'opendata';
  }
  return 'unknown';
};

const parseApiFilter = (filters?: string[]) =>
  (filters ?? []).reduce<Record<string, string>>((prev, curr) => {
    const [key, value] = curr.split('=');
    return { ...prev, [key]: value };
  }, {});

const parseLastUpdated = (lastUpdated?: string) => {
  if (lastUpdated == null) {
    return undefined;
  }

  let parsedDate = parse(lastUpdated, 'dd.MM.yyyy HH:mm', new Date());

  if (isNaN(parsedDate.getTime())) {
    parsedDate = new Date(lastUpdated);
  }
  
  return parsedDate
};

const hasApiFilter = (dataset: TourismMetaData) =>
  Object.keys(dataset.apiFilter).length > 0;

const parseApiType = (apiType?: string, apiUrl?: string): ApiType => {
  if (apiType === 'content') {
    return 'content';
  }
  if (apiType === 'timeseries') {
    return 'timeseries';
  }

  // Fallback to heuristic based on apiUrl
  if (apiUrl == null) {
    return 'unknown';
  }
  if (apiUrl?.includes('tourism')) {
    return 'content';
  }
  if (apiUrl?.includes('mobility')) {
    return 'timeseries';
  }

  return 'unknown';
};

const parseLicenseInfo = (licenseInfo?: {
  Author?: string;
  License?: string;
  ClosedData?: boolean;
  LicenseHolder?: string;
}) => {
  if (licenseInfo == null) {
    return undefined;
  }
  return {
    author: licenseInfo.Author,
    license: licenseInfo.License,
    closedData: licenseInfo.ClosedData,
    licenseHolder: licenseInfo.LicenseHolder,
  };
};
