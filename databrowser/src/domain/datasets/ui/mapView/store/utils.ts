// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { KnownApiType } from '../../../../metaDataConfig/types';
import { MapDatasetApi } from '../types';

export const getDatasetUrl = ({ apiType, apiUrl }: MapDatasetApi): string => {
  switch (apiType) {
    case 'content': {
      const url = new URL(apiUrl);
      url.searchParams.set('pagesize', '1000000');
      url.searchParams.set('fields', 'Id,GpsInfo,Shortname');
      return url.toString();
    }
    case 'timeseries': {
      const url = new URL(apiUrl);
      url.searchParams.set('limit', '1000000');
      return url.toString();
    }
  }
};

export const getRecordUrl = (
  apiType: KnownApiType,
  externalLink: string,
  recordId: string
): string => {
  //   try {
  // Remove all query parameters from API url
  const url = new URL(externalLink);
  for (const key of url.searchParams.keys()) {
    url.searchParams.delete(key);
  }

  switch (apiType) {
    case 'content':
      return `${url.toString()}/${recordId}`;
    case 'timeseries':
      return `${url.toString()}?scode=${recordId}`;
  }
};
