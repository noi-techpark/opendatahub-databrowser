// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  QueryFunction,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/vue-query';
import { MaybeRef, computed, readonly, toValue } from 'vue';
import { axiosWithMaybeAuth } from './apiAuth';

export const useApiRead = <TQueryFnData = unknown, TData = TQueryFnData>(
  url: MaybeRef<string | undefined>,
  options?: MaybeRef<
    Partial<
      UseQueryOptions<TQueryFnData, Error, TData, TQueryFnData> & {
        withAuth?: boolean;
        apiType?: string;
      }
    >
  >
) => {
  // Compute query key from url
  const queryKey = readonly(
    computed<(string | undefined)[]>(() => [toValue(url)])
  );
  // Create query function using axios
  const queryFn: QueryFunction<TQueryFnData, readonly unknown[]> = async ({
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
