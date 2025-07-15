// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import axios, { AxiosProgressEvent } from 'axios';
import { readonly, ref } from 'vue';
import { toError } from '../utils/convertError';
import { wrapAxiosFetchWithAuth } from './apiAuth';

export const useDownload = (url: string) => {
  const downloading = ref(false);
  const downloadAbortController = ref(new AbortController());
  const downloadProgress = ref(0);
  const downloadError = ref<string | undefined>();
  const isDownloadError = ref(false);
  const isDownloadSuccess = ref(false);
  const downloadResponse = ref<string | null>();

  const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
    console.debug('Download progress:', progressEvent);
    if (progressEvent.total != null) {
      downloadProgress.value = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    }
  };

  const startDownload = async () => {
    try {
      console.log('Starting download from URL:', url);
      downloading.value = true;

      const axiosInstance = await wrapAxiosFetchWithAuth(axios);
      const response = await axiosInstance.get<string>(url, {
        signal: downloadAbortController.value.signal,
        onDownloadProgress,
      });

      console.debug('Download success', response.status);

      isDownloadSuccess.value = true;
      downloadResponse.value = response.data;
    } catch (error) {
      isDownloadError.value = true;
      const errorMessage = toError(error).message;
      downloadError.value = errorMessage;
    } finally {
      downloading.value = false;
    }
  };

  return {
    isDownloadError: readonly(isDownloadError),
    isDownloadSuccess: readonly(isDownloadSuccess),
    downloading: readonly(downloading),
    downloadAbortController: readonly(downloadAbortController),
    downloadError: readonly(downloadError),
    downloadProgress: readonly(downloadProgress),
    downloadResponse: readonly(downloadResponse),
    startDownload,
  };
};
