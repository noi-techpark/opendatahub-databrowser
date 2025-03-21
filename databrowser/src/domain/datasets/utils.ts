// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computeTableLocation } from '../../domain/datasets/location/datasetViewLocation';
import { TourismMetaData } from '../metaDataConfig/tourism/types';
import {
  apiDomainToApiType,
  getApiDomainFromMetaData,
} from '../metaDataConfig/utils';
import { RecordId } from './types';

export const computeRecordId = (
  domain: string | undefined,
  record?: unknown
): RecordId => {
  if (record == null || Array.isArray(record)) {
    return undefined;
  }

  const apiType = apiDomainToApiType(domain);

  switch (apiType) {
    case 'content': {
      const maybeTourism = record as { id?: string; Id?: string };
      return idToString(maybeTourism.id ?? maybeTourism.Id);
    }
    case 'timeseries': {
      // scode is the station code, evuuid is the event uuid, id is the generic id
      const maybeMobility = record as {
        scode?: string;
        evuuid?: string;
        id?: string;
      };
      return idToString(
        maybeMobility.scode ?? maybeMobility.evuuid ?? maybeMobility.id
      );
    }
    case 'unknown': {
      const maybeDefault = record as { id?: string };
      return idToString(maybeDefault.id);
    }
  }
};

const idToString = (id: unknown) => (id == null ? undefined : id.toString());

export const getTableLocationFromDataset = (dataset: TourismMetaData) => {
  const domain = getApiDomainFromMetaData(dataset);

  if (domain === 'unknown') {
    return;
  }

  const { pathSegments, apiFilter } = dataset;

  return computeTableLocation(domain, pathSegments, apiFilter);
};
