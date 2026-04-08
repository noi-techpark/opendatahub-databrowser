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

  const sendSync = async (syncUrl: string) => {
    isSynced.value = false;

    try {
      const res = await sendSyncRequest(syncUrl);

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
  syncUrl: string
): Promise<SyncResponse> => {
  const axios = await axiosWithMaybeAuth(true);

  try {
    const { data } = await axios<OdhSyncResponse>({
      url: syncUrl,
      method: 'post',
    });

    return {
      response: {
        success: data.success,
        error: data.success ? undefined : (data.exception ?? data.message),
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
