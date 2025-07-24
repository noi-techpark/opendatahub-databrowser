// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Download } from '../../domain/download/types';

export const saveDownload = (download: Download) => {
  if (download.data == null) {
    console.error(`Download data for ${download.name} is not available.`);
    return;
  }

  const link = document.createElement('a');
  link.href = URL.createObjectURL(download.data);
  link.type = download.format === 'json' ? 'application/json' : 'text/csv';
  link.download = download.name;
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
