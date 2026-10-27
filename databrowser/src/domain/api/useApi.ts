// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  QueryFunction,
  UseMutationReturnType,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/vue-query';
import { MaybeRef, computed, readonly, toValue } from 'vue';
import { axiosWithMaybeAuth } from './apiAuth';

// Options and query function must share the query key type
type ApiReadQueryKey = readonly unknown[];

export const useApiRead = <TQueryFnData = unknown, TData = TQueryFnData>(
  url: MaybeRef<string | undefined>,
  options?: MaybeRef<
    Partial<
      UseQueryOptions<
        TQueryFnData,
        Error,
        TData,
        TQueryFnData,
        ApiReadQueryKey
      > & {
        withAuth?: boolean;
        apiType?: string;
      }
    >
  >
) => {
  // Compute query key from url
  const queryKey = readonly(computed<unknown[]>(() => [toValue(url)]));
  // Create query function using axios
  const queryFn: QueryFunction<TQueryFnData, ApiReadQueryKey> = async ({
    queryKey: [url],
  }) => {
    const axiosInstance = await axiosWithMaybeAuth(
      toValue(options)?.withAuth ?? false,
      toValue(options)?.apiType
    );
    return axiosInstance
      .get<TQueryFnData>(url as string)
      .then((response) => response.data);
  };

  // Run query
  return useQuery({ retry: 1, ...toValue(options), queryKey, queryFn });
};

// Named alias for useMutation's mutate function, whose own type
// (MutateSyncFunction) is not exported by @tanstack/vue-query
export type ApiMutateFunction = UseMutationReturnType<
  unknown,
  Error,
  unknown,
  unknown
>['mutate'];

export const useApiMutate = (
  url: MaybeRef<string | undefined>,
  options?: {
    method: MaybeRef<'post' | 'put' | 'patch' | 'delete'>;
  }
) => {
  // Create mutation function using axios
  const mutationFn = async (requestData: unknown) => {
    const axiosInstance = await axiosWithMaybeAuth(true);
    return axiosInstance
      .request({
        url: toValue(url),
        method: toValue(options?.method),
        data: requestData,
      })
      .then((response) => response.data);
  };

  return useMutation({ mutationFn });
};
