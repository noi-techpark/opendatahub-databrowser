// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Download } from '../../domain/download/types';

export const saveDownload = (download: Download) => {
  if (download.data == null) {
    console.error(`Download data for ${download.name} is not available.`);
    return;
  }

  const blob = downloadToBlob(download.data, download.format);

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = download.name;
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const downloadToBlob = (data: string, format: Download['format']): Blob => {
  if (format === 'json') {
    return new Blob([JSON.stringify(data)], { type: 'application/json' });
  }
  return new Blob([data], { type: `text/csv` });
};
