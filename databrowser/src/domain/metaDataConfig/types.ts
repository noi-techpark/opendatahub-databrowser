// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export type ApiDomain = 'tourism' | 'mobility' | 'unknown';

export type ApiType = 'content' | 'timeseries' | 'unknown';

export type KnownApiType = Exclude<ApiType, 'unknown'>;
