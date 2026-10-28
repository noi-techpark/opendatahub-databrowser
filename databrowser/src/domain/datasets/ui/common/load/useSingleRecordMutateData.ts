// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, computed, toValue } from 'vue';
import { ApiMutateFunction, useApiMutate } from '../../../../api/useApi';

export const useSingleRecordMutateData = (
  fullPath: MaybeRef<string | undefined>,
  isNewView: MaybeRef<boolean>
) => {
  const method = computed(() => (toValue(isNewView) ? 'post' : 'put'));

  const { data, error, isError, isSuccess, isPending, mutate } = useApiMutate(
    fullPath,
    { method }
  );

  return {
    mutateData: data,
    mutateError: error,
    isMutateLoading: isPending,
    isMutateError: isError,
    isMutateSuccess: isSuccess,
    mutate: mutate as ApiMutateFunction,
  };
};
