// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { withOdhBaseUrl } from '@/config/utils.ts';
import { unwrapData } from '../api/dataExtraction';
import { useApiRead } from '../api/useApi';
import { WithTourismPagination } from '../datasets/pagination/types';
import { TourismSyncSource } from './types';

interface SyncDataConfigItem {
  BaseUrl: string;
  PathParam: string[];
  SyncDataApiUrl: string;
}

interface OdhSource {
  Key: string;
  Name: Record<string, string>;
  SyncDataConfig: SyncDataConfigItem[] | null;
}

const sourceUrl = withOdhBaseUrl('/v1/Source?pagesize=-1');

export const useSyncSource = () =>
  useApiRead(sourceUrl, { select, queryKey: [sourceUrl] });

const select = (
  data: WithTourismPagination<OdhSource[]>
): TourismSyncSource[] => {
  const unwrappedData = unwrapData<OdhSource[]>(data);
  return unwrappedData
    .filter(
      (source) =>
        source.SyncDataConfig != null && source.SyncDataConfig.length > 0
    )
    .map<TourismSyncSource>((source) => ({
      key: source.Key,
      name: source.Name,
      syncDataApiUrl: source.SyncDataConfig![0].SyncDataApiUrl,
    }));
};
