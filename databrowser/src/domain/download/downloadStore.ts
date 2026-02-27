// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AxiosError } from 'axios';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { watch } from 'vue';
import { useDownload } from '../api/useDownload';
import { toError } from '../utils/convertError';
import { Download } from './types';

interface State {
  downloads: Download[];
}

const initialState: State = {
  downloads: [],
};

export const useDownloadStore = defineStore('downloadStore', {
  state: () => initialState,
  getters: {
    activeDownloads(state) {
      return state.downloads.filter(
        (download) => download.status === 'in-progress'
      );
    },
    completedDownloads(state) {
      return state.downloads.filter(
        (download) => download.status === 'completed'
      );
    },
    failedDownloads(state) {
      return state.downloads.filter((download) => download.status === 'failed');
    },
  },
  actions: {
    async startDownload(
      url: string,
      filename: string,
      format: Download['format']
    ) {
      // Generate unique ID for this download
      const downloadId = `download-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Add download to store
      this.downloads.push({
        id: downloadId,
        url,
        name: `${filename}.${format}`,
        format,
        status: 'in-progress',
        progress: 0,
        error: null,
        data: null,
        abortController: null,
      });

      await this._executeDownload(downloadId);
    },
    async retryDownload(id: string) {
      await this._executeDownload(id);
    },
    abortDownload(id: string) {
      const download = this.downloads.find((d) => d.id === id);
      if (download && download.status === 'in-progress') {
        if (download.abortController) {
          download.abortController?.abort('Download aborted');
        } else {
          this.updateDownload(id, 'failed', 0, 'Download aborted', null);
        }
      }
    },
    abortAllDownloads() {
      this.downloads.forEach((download) => {
        if (download.status === 'in-progress' && download.abortController) {
          download.abortController.abort('All downloads aborted');
        }
      });
    },
    removeDownload(id: string) {
      this.downloads = this.downloads.filter((d) => d.id !== id);
    },
    removeAllDownloads() {
      this.downloads = [];
    },
    updateDownload(
      id: string,
      status: 'in-progress' | 'completed' | 'failed',
      progress: number,
      error: string | null,
      data: Blob | null
    ) {
      const download = this.downloads.find((d) => d.id === id);
      if (download != null) {
        download.status = status;
        download.progress = progress;
        download.error = error;
        download.data = data;
        if (status !== 'in-progress') {
          download.abortController = null;
        }
      }
    },
    async _executeDownload(id: string) {
      const download = this.downloads.find((d) => d.id === id);
      if (download == null) {
        throw new Error(`Download not found: ${id}`);
      }

      this.updateDownload(id, 'in-progress', 0, null, null);

      try {
        // Create a new download instance
        const {
          downloadProgress,
          downloadResponse,
          downloadAbortController,
          startDownload,
        } = useDownload(
          download.url,
          download.format === 'csv' ? 'text/csv' : 'application/json'
        );

        // Assign the abort controller for this download to be able to abort it later
        download.abortController = downloadAbortController.value;

        // Watch for download progress updates
        // Note: if the server does not provide a Content-Length header,
        // the progress will not be accurate, meaning that it starts at 0
        // and goes to 100% without intermediate values.
        watch(downloadProgress, (progress) => {
          console.log(`Download progress for ${download.name}: ${progress}%`);
          this.updateDownload(download.id, 'in-progress', progress, null, null);
        });

        // Start the download
        await startDownload();

        // Update the download status to completed
        this.updateDownload(
          download.id,
          'completed',
          100,
          null,
          downloadResponse.value
        );
      } catch (error) {
        // Check if the error is an Axios error and if it means that the user aborted the download
        const isAbortError =
          error instanceof AxiosError &&
          (error.name === 'CanceledError' || error.code === 'ERR_CANCELED');

        // Extract error message
        let errorMessage: string;
        if (isAbortError) {
          errorMessage =
            download.abortController?.signal.reason || 'Download aborted';
        } else if (
          error instanceof AxiosError &&
          error.response?.data instanceof Blob
        ) {
          try {
            const text = await error.response.data.text();
            try {
              const json = JSON.parse(text);
              errorMessage =
                json.message ||
                json.error ||
                json.detail ||
                `(${error.response.status}) ${text.slice(0, 300)}`;
            } catch {
              errorMessage = `(${error.response?.status}) ${text.slice(0, 300)}`;
            }
          } catch {
            errorMessage = toError(error).message;
          }
        } else {
          // Otherwise, convert the error to a standard Error object
          errorMessage = toError(error).message;
        }

        this.updateDownload(download.id, 'failed', 0, errorMessage, null);
      }
    },
  },
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot));
}
