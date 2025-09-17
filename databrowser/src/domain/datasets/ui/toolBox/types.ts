// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Component } from 'vue';

export interface ReferenceInfoToolBoxFetchUrlInfo {
  from: string;
  url: string;
}

export enum ToolBoxSectionKey {
  NONE = 'NONE',
  FILTERS = 'FILTERS',
  ATTRIBUTES = 'ATTRIBUTES',
  ACTIONS = 'ACTIONS',
  EXPORTS = 'EXPORTS',
  SETTINGS = 'SETTINGS',
}

export interface ToolBoxSection {
  sectionKey: ToolBoxSectionKey;
  title: string;
  iconComponent?: Component;
  infoComponent?: Component;
  component: Component;
}
