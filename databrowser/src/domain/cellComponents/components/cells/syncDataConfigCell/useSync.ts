// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { axiosWithMaybeAuth } from '../../../../api/apiAuth';
import { OdhSyncResponse, SyncResponse } from './types';
import { ref } from 'vue';
import { getAxiosErrorMessage } from '@/domain/utils/convertError';

export const useSync = () => {
  const isSynced = ref(false);
  const syncResponse = ref<SyncResponse | null>(null);

  const sendSync = async (metaType: string, id: string) => {
    isSynced.value = false;

    try {
      const res = await sendSyncRequest(metaType, id);

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

export const sendSyncRequest = async (
  metaType: string,
  id: string
): Promise<SyncResponse> => {
  const axios = await axiosWithMaybeAuth(true);

  const baseUrl = import.meta.env.VITE_APP_SYNC_URL;
  try {
    const { data } = await axios<OdhSyncResponse>({
      url: `${baseUrl}/${metaType}/${id}`,
      method: 'post',
    });

    return {
      response: {
        UpdateInfo: data.UpdateInfo,
        success: data.Result.Success,
        error: data.Result.Success ? undefined : data.Result.Response,
      },
    };
  } catch (error) {
    const message = getAxiosErrorMessage(error);
    return {
      response: {
        success: false,
        error: message,
      },
    };
  }
};
