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
  Result: {
    Response: string;
    HttpStatusCode: string;
    Service: string;
    Success: boolean;
  };
  UpdateInfo: SyncPayload;
}
