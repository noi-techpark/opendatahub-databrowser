// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, computed, toValue } from 'vue';
import {
  buildTargetFromArrayMapping,
  buildTargetFromObjectMapping,
} from '../../../config/mapping/utils';
import { DatasetDomain, ListElements } from '../../../config/types';
import { computeRecordId } from '../../../utils';
import { RecordValues } from './types';

export const computeTableRows = (
  datasetDomain: DatasetDomain | undefined,
  cols: ListElements[],
  data: unknown[]
) => {
  if (datasetDomain == null) {
    return [];
  }

  return data.map<RecordValues>((row) => ({
    recordId: computeRecordId(datasetDomain, row),
    values: cols.map<Record<string, unknown>>((col) =>
      col.objectMapping != null
        ? buildTargetFromObjectMapping(row, col.objectMapping, col.params)
        : buildTargetFromArrayMapping(row, col.arrayMapping, col.params)
    ),
  }));
};

export const useTableRows = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  cols: MaybeRef<ListElements[]>,
  data: MaybeRef<unknown[]>
) =>
  computed(() =>
    computeTableRows(toValue(datasetDomain), toValue(cols), toValue(data))
  );
