// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface Publisher {
  id: string;
  name: string;
  url: string;
}

export interface PushResponse {
  success: boolean;
  id?: string;
  date?: string;
  error?: string;
}

export interface PublisherWithPushResponse extends Publisher {
  pushResponse: PushResponse;
}

export interface OdhPushResponse {
  Id: string;
  Publisher: string;
  Date: string;
  Result: {
    Response: string;
    HttpStatusCode: string;
    Service: string;
    Success: boolean;
  };
  PushObject?: {
    Id: string;
    Type: string;
  };
}

export type OdhPushResponseMany = Record<string, OdhPushResponse>;

export interface PushResponseData {
  state: 'empty' | 'info' | 'ok' | 'error';
  id?: string;
  date?: string;
  dateAgo?: string;
  dateFormatted?: string;
  message?: string;
}
