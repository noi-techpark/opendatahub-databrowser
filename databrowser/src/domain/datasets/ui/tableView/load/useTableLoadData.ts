// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import { MaybeRef, unref } from 'vue';
import { computed } from 'vue';
import { useUnwrapData } from '../../../../api/dataExtraction';
import { useApiRead } from '../../../../api/useApi';
import { DatasetDomain, DatasetQuery } from '../../../config/types';
import { usePagination } from '../../../pagination/usePagination';
import { useHandleDataLoading } from './useHandleDataLoading';
import { useEnrichWithPushResponse } from './useEnrichWithPushResponse';

export const useTableLoadData = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  datasetQuery: MaybeRef<DatasetQuery | undefined>,
  fullPath: MaybeRef<string | undefined>,
  pushResponseFullPath: MaybeRef<string | undefined>
) => {
  const {
    data,
    error: mainError,
    isError: isMainError,
    isLoading: isMainLoading,
    refetch: refetchMain,
  } = useApiRead(fullPath, {
    withAuth: true,
    queryKey: [fullPath],
  });

  const unwrappedData = useUnwrapData<unknown[]>(data);

  // add enriched data from push response
  const pushPath = computed(() => unref(pushResponseFullPath));
  const pushEnabled = computed(() => !!pushPath.value);
  const pushHook = useEnrichWithPushResponse(pushResponseFullPath, unwrappedData, {
    enabled: pushEnabled,
    merge: (base, extra) => ({ ...base, _PushResponseData: extra }),
  });

  const isLoading = computed(() => (isMainLoading.value || (pushHook && pushHook.isLoading.value)));
  const isError = computed(() => (isMainError.value || (pushHook && pushHook.isError.value)));
  const error = computed(() => mainError.value ?? (pushHook && pushHook.error.value));

  const dataWithLoadingSupport = useHandleDataLoading(isLoading, (pushHook && pushHook.mergedData) ?? unwrappedData);
  const pagination = usePagination(datasetDomain, datasetQuery, data);

  const refetch = async () => {
    await refetchMain();
    if(pushHook){
      await pushHook.refetch();
    }
  };

  return {
    data: dataWithLoadingSupport,
    pagination,
    error,
    isError,
    isDataLoading: isLoading,
    refetch,
  };
};
