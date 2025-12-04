// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { stringifyQuery } from 'vue-router';
import {
  DatasetDomain,
  DatasetId,
  DatasetPath,
  DatasetQuery,
} from '../config/types';
import {
  domainIsKnownToHaveOpenApiDocument,
  domainWithOpenApiDocument,
} from '../../openApi';

export const computeApiBaseUrl = (domain: DatasetDomain) => {
  if (domainIsKnownToHaveOpenApiDocument(domain)) {
    return domainWithOpenApiDocument[domain].baseUrl;
  }
  console.error('Unknown domain, can not compute base URL', domain);
};

export const computeApiPath = (path: DatasetPath) => path.join('/');

export const computeApiFullUrl = (
  domain: DatasetDomain,
  path: DatasetPath,
  id: DatasetId | undefined,
  query: DatasetQuery | undefined
) => {
  if (domain === 'tourism') {
    return computeApiFullUrlForTourismDomain(domain, path, id, query);
  }

  if (domain === 'mobility') {
    return computeApiFullUrlForMobilityDomain(domain, path, id, query);
  }

  return computeApiFullUrlForFallbackDomain(domain, path, id, query);
};

const computeApiFullUrlForTourismDomain = (
  domain: DatasetDomain,
  path: DatasetPath,
  id: DatasetId | undefined,
  query: DatasetQuery | undefined
) => {
  const baseUrl = computeApiBaseUrl(domain);
  const pathString = computeApiPath(path);
  const idString = id == null ? '' : `/${id}`;
  const queryString = query == null ? '' : `?${stringifyQuery(query.raw)}`;
  return `${baseUrl}/${pathString}${idString}${queryString}`;
};

// Fallback uses the same handling as for tourism domain
const computeApiFullUrlForFallbackDomain = (
  domain: DatasetDomain,
  path: DatasetPath,
  id: DatasetId | undefined,
  query: DatasetQuery | undefined
) => computeApiFullUrlForTourismDomain(domain, path, id, query);

const computeApiFullUrlForMobilityDomain = (
  domain: DatasetDomain,
  path: DatasetPath,
  id: DatasetId | undefined,
  query: DatasetQuery | undefined
) => {
  const baseUrl = computeApiBaseUrl(domain);

  const idProperty =
    path.at(1) === 'flat'
      ? // Station type mobility uses the scode property as id
        'scode'
      : path.at(1) === 'flat,event'
        ? // Event origin mobility uses the evuuid property as id
          'evuuid'
        : // Unknown mobility type, no id property
          null;

  // The URL for event origin details nodes uses all path params except the last one
  // All other mobility nodes use all path params
  const pathString =
    idProperty === 'evuuid' && id != null
      ? computeApiPath(path.slice(0, -1))
      : computeApiPath(path);

  const enhancedQuery = query == null ? {} : { ...query.raw };

  if (id != null && idProperty != null) {
    // Add the id to the query
    enhancedQuery['where'] = `and(${idProperty}.eq."${id}")`;
  }

  const queryString = `?${stringifyQuery(enhancedQuery)}`;
  const latest = id != null ? '/*/latest' : '';
  return `${baseUrl}/${pathString}${latest}${queryString}`;
};
