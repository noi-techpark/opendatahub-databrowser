// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TourismMetaData } from './tourism/types';
import { ApiDomain, ApiType } from './types';

export const apiDomainToApiType = (domain?: string): ApiType => {
  switch (domain) {
    case 'tourism':
      return 'content';
    case 'mobility':
      return 'timeseries';
    default:
      return 'unknown';
  }
};

export const apiTypeToApiDomain = (type?: string): ApiDomain => {
  switch (type) {
    case 'content':
      return 'tourism';
    case 'timeseries':
      return 'mobility';
    default:
      return 'unknown';
  }
};

export const getApiDomainFromMetaData = (
  dataset?: Pick<TourismMetaData, 'apiType' | 'baseUrl'>
): ApiDomain => {
  if (dataset == null) {
    console.error('Can not infer API domain, no dataset provided');
    return 'unknown';
  }

  const { apiType, baseUrl } = dataset;

  if (apiType != null) {
    // Add here all apiTypes
    switch (apiType) {
      case 'content':
        return 'tourism';
      case 'timeseries':
        return 'mobility';
      default:
        return 'unknown';
    }
  }

  // If no apiType is present, then fallback to heuristic based on URL
  if (baseUrl.includes('tourism')) {
    return 'tourism';
  }
  if (baseUrl.includes('mobility')) {
    return 'mobility';
  }

  // It is not possible to infer the API domain, return unknown
  console.error(
    `Can not infer API domain, because no API type is given and baseUrl "${baseUrl}" is unknown`,
    dataset
  );
  return 'unknown';
};

export const getApiTypeFromMetaData = (
  dataset?: Pick<TourismMetaData, 'apiType' | 'baseUrl'>
): ApiType => {
  if (dataset == null) {
    console.error('Can not infer API type, no dataset provided');
    return 'unknown';
  }

  const { apiType, baseUrl } = dataset;

  if (apiType != null) {
    // Add here all apiTypes
    switch (apiType) {
      case 'content':
        return 'content';
      case 'timeseries':
        return 'timeseries';
      default:
        return 'unknown';
    }
  }

  // Fallback to heuristic
  if (baseUrl.includes('tourism')) {
    return 'content';
  }
  if (baseUrl.includes('mobility')) {
    return 'timeseries';
  }

  // It is not possible to infer the API type, return unknown
  console.error(
    `Can not infer API type, because no API type is given and baseUrl "${baseUrl}" is unknown`,
    dataset
  );
  return 'unknown';
};
