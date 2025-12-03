// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AxiosError } from 'axios';
import { axiosWithMaybeAuth } from '../../../../api/apiAuth';
import { OdhSyncResponse, SyncResponse } from './types';
import { ref } from 'vue';

export const useSync = () => {
  const isSynced = ref(false);

  // Array of sync results (puoi adattare a ciò che vuoi mostrare in UI)
  const syncResponse = ref<SyncResponse | null>(null);

  const sendSync = async (metaType: string, id: string) => {
    isSynced.value = false;

    try {
      const res = await sendSyncRequest(metaType, id);
      console.log('res res is ', res);

      syncResponse.value = res;
      isSynced.value = res.response.success;
    } catch (err) {
      console.error(err);
      isSynced.value = false;
    }
  };

  return {
    isSynced,
    syncResponse,
    sendSync,
  };
};

// chiamata di sync per UN item
export const sendSyncRequest = async (
  metaType: string,
  id: string
): Promise<SyncResponse> => {
  const axios = await axiosWithMaybeAuth(true);

  const baseUrl = import.meta.env.VITE_APP_SYNC_URL;
  try {
    // https://tourism.importer.opendatahub.com/Raven/{metaType}/Update/{id}
    const { data } = await axios<OdhSyncResponse>({
      url: `${baseUrl}/${metaType}/Update/${id}`,
      method: 'post',
    });
    console.log('sync response data:', data);

    return {
      response: {
        UpdateInfo: data.UpdateInfo,
        success: data.Result.Success,
        error: data.Result.Success ? undefined : data.Result.Response,
      },
    };
  } catch (error) {
    const message = getErrorMessage(error);
    return {
      response: {
        success: false,
        error: message,
      },
    };
  }
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return `(${error.response?.status}) ${error.response?.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return error as string;
};
