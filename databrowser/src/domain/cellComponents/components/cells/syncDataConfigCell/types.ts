// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface SyncDataConfigEntry {
  baseurl?: string;
  pathparam?: string[];
  syncdataapiurl?: string;
}


export interface SyncPayload {
  UpdatedBy: string;
  UpdateSource: string;
}
export interface SyncResponsePayload {
  success: boolean;
  UpdateInfo?: SyncPayload;
  error?: string;
}
export interface SyncResponse {
 response: SyncResponsePayload;
}



export interface OdhSyncResponse {
  operation: string;
  updatetype: string;
  otherinfo: string;
  message: string;
  success: boolean;
  recordsmodified: number | null;
  updated: string | null;
  created: string | null;
  deleted: string | null;
  error: string | null;
  id: string;
  exception: string | null;
  source: string;
}
