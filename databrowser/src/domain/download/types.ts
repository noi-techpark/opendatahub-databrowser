// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface Download {
  id: string;
  url: string;
  name: string;
  format: 'csv' | 'json';
  status: 'in-progress' | 'completed' | 'failed';
  progress: number;
  error: string | null;
  data: Blob | null;
  abortController: AbortController | null;
}
