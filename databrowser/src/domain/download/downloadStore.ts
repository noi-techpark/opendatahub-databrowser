// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import { watch } from 'vue';
import { useDownload } from '../api/useDownload';

export const useDownloadStore = defineStore('downloadStore', {
  state: () => ({
    downloads: [] as Array<{
      id: string;
      name: string;
      status: 'in-progress' | 'completed' | 'failed';
      progress: number;
      error?: string;
    }>,
  }),
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
    async startDownload(url: string) {
      // Generate unique ID for this download
      const downloadId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Extract filename from URL or use default
      const filename = extractFilenameFromUrl(url) || 'download';

      // Add download to store
      this.downloads.push({
        id: downloadId,
        name: filename,
        status: 'in-progress',
        progress: 0,
      });

      try {
        const { downloadProgress, startDownload } = useDownload(url);

        // Watch for download progress updates
        watch(downloadProgress, (progress) => {
          console.log(`Download progress for ${filename}: ${progress}%`);
          this.updateDownload(downloadId, 'in-progress', progress);
        });

        console.log(`Starting download: ${filename} (${downloadId})`);
        // Start the download
        await startDownload();

        this.updateDownload(downloadId, 'completed', 100);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.updateDownload(downloadId, 'failed', 0, errorMessage);
        throw error;
      }
    },
    updateDownload(
      id: string,
      status: 'in-progress' | 'completed' | 'failed',
      progress: number,
      error?: string
    ) {
      const download = this.downloads.find((d) => d.id === id);
      if (download) {
        download.status = status;
        download.progress = progress;
        if (error) {
          download.error = error;
        }
      }
    },
    removeDownload(id: string) {
      this.downloads = this.downloads.filter((d) => d.id !== id);
    },
  },
});

/**
 * Extracts filename from URL
 * @param url - The URL to extract filename from
 * @returns The extracted filename or null
 */
const extractFilenameFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    return filename && filename.length > 0 ? filename : null;
  } catch {
    return null;
  }
};

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDownloadStore, import.meta.hot));
}
