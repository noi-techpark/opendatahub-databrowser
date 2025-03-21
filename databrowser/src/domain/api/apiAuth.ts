// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosStatic,
  InternalAxiosRequestConfig,
} from 'axios';
import { storeToRefs } from 'pinia';
import { computed, MaybeRef, Ref, toValue, watch } from 'vue';
import { useAuth } from '../auth/store/auth';
import { useDatasetBaseInfoStore } from '../datasets/config/store/datasetBaseInfoStore';

export const buildAuthInterceptor = (apiType: Ref<string | undefined>) => {
  const addAuthToCtx = (
    ctx: AxiosRequestConfig,
    authenticated: boolean,
    accessToken: string | null
  ) => {
    if (authenticated) {
      ctx.headers = {
        ...ctx.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  };

  const datasetDomain = computed(
    () => apiType.value ?? useDatasetBaseInfoStore().datasetDomain
  );
  const { ready, isAuthenticated, accessToken } = storeToRefs(useAuth());

  return async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // Auth is supported at the moment only for tourism (aka content)
    // domain. For all other domains, we don't add auth information.
    const withAuth =
      // The apiType can be provided by method param. It is
      // useful when we want to specify the api type manually
      apiType.value === 'content' ||
      // As fallback we try to get the dataset domain from the store.
      // This is useful when we are in the table, detail, edit or raw
      // view, because then the dataset domain is already set, no need
      // to pass it as param.
      datasetDomain.value === 'tourism';

    if (withAuth) {
      return new Promise((resolve) => {
        // Wait for the auth store to be ready
        watch(
          ready,
          (ready) => {
            if (ready) {
              addAuthToCtx(config, isAuthenticated.value, accessToken.value);
              resolve(config);
            }
          },
          { immediate: true }
        );
      });
    }

    return Promise.resolve(config);
  };
};

export const wrapAxiosFetchWithAuth = async (
  axiosInstance: AxiosInstance,
  options?: MaybeRef<{ apiType?: string }>
) => {
  const apiType = computed(() => toValue(options)?.apiType);

  const authInfo = await buildAuthInterceptor(apiType);
  // Create new axios instance because we add an interceptor
  // that should be used only for this request
  // Note that due to a bug in axios, we need to cast the instance
  const axios = (axiosInstance as AxiosStatic).create() as AxiosInstance;
  axios.interceptors.request.use(authInfo);
  return axios;
};

export const axiosWithMaybeAuth = async (
  withAuth?: boolean,
  apiType?: string
) => {
  return withAuth ? await wrapAxiosFetchWithAuth(axios, { apiType }) : axios;
};
