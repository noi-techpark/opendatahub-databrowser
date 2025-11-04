// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { reactiveComputed } from '@vueuse/core';
import { MaybeRef, computed, toRefs, toValue } from 'vue';
import { DatasetPage } from '../../../routes';
import { RecordId } from '../types';
import { DatasetDomain, DatasetPath, DatasetQuery } from '../config/types';
import { defaultLanguage } from '../language';
import { DatasetLocationRoute, DatasetLocations } from './types';

export const computeTableLocation = (
  domain: string | undefined,
  pathSegments: DatasetPath | undefined,
  query: DatasetQuery['raw'] | undefined = {}
): DatasetLocationRoute => {
  // Check if it is possible to compute the locations at all
  if (domain == null || pathSegments == null) {
    return {};
  }
  return { params: { domain, pathSegments }, query, name: DatasetPage.TABLE };
};

export const computeSingleRecordLocations = (
  domain: string | undefined,
  pathSegments: DatasetPath | undefined,
  query: DatasetQuery['raw'] | undefined = {},
  recordId?: RecordId
): Omit<DatasetLocations, 'tableLocation'> => {
  // Check if it is possible to compute the locations at all
  if (domain == null || pathSegments == null || recordId == null) {
    return {};
  }

  const params = { domain, pathSegments, id: recordId };

  const singleRecordQuery = { ...query };

  if (domain === 'tourism') {
    delete singleRecordQuery['rawsort'];
    delete singleRecordQuery['rawfilter'];
    delete singleRecordQuery['pagenumber'];
    delete singleRecordQuery['pagesize'];
    if (query.language === defaultLanguage) {
      delete singleRecordQuery['language'];
    }
  } else if (domain === 'mobility') {
    delete singleRecordQuery['where'];
    delete singleRecordQuery['offset'];
    delete singleRecordQuery['limit'];
    if (pathSegments.length > 3) {
      params.pathSegments = pathSegments.slice(0, 3);
    }
  }

  const singleRecordLocation = {
    params,
    query: singleRecordQuery,
  };

  return {
    detailLocation: { ...singleRecordLocation, name: DatasetPage.DETAIL },
    editLocation: { ...singleRecordLocation, name: DatasetPage.EDIT },
    newLocation: { ...params, name: DatasetPage.NEW },
    rawLocation: { ...singleRecordLocation, name: DatasetPage.RAW },
  };
};

export const computeDatasetViewLocations = (
  domain: string | undefined,
  pathSegments: DatasetPath | undefined,
  query: DatasetQuery['raw'] | undefined = {},
  recordId?: RecordId
): DatasetLocations => {
  return {
    tableLocation: computeTableLocation(domain, pathSegments, query),
    ...computeSingleRecordLocations(domain, pathSegments, query, recordId),
  };
};

export const useTableLocation = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  datasetPath: MaybeRef<DatasetPath | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>
) => {
  return computed(() =>
    computeTableLocation(
      toValue(datasetDomain),
      toValue(datasetPath) as DatasetPath,
      toValue(datasetQuery)?.raw as DatasetQuery['raw']
    )
  );
};

export const useSingleRecordLocations = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  datasetPath: MaybeRef<DatasetPath | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>,
  recordId?: MaybeRef<RecordId>
) => {
  const result = reactiveComputed(() =>
    computeSingleRecordLocations(
      toValue(datasetDomain),
      toValue(datasetPath) as DatasetPath,
      toValue(datasetQuery)?.raw as DatasetQuery['raw'],
      toValue(recordId)
    )
  );

  return toRefs(result);
};

export const useDatasetViewLocations = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  datasetPath: MaybeRef<DatasetPath | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>,
  recordId?: MaybeRef<RecordId>
) => {
  const result = reactiveComputed<DatasetLocations>(() =>
    computeDatasetViewLocations(
      toValue(datasetDomain),
      toValue(datasetPath) as DatasetPath,
      toValue(datasetQuery)?.raw as DatasetQuery['raw'],
      toValue(recordId)
    )
  );

  return toRefs(result);
};
