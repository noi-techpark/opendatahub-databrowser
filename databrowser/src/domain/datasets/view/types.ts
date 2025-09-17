// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  DetailViewConfig,
  EditViewConfig,
  ListViewConfig,
  NewViewConfig,
  RawViewConfig,
  ViewKey,
} from '../config/types';

export type StringReplacer = (s: string) => string;

export type ObjectValueReplacer = (
  object?: Record<string, string>
) => Record<string, string>;

interface WithViewKey {
  type: ViewKey;
}

export interface ListViewConfigWithType extends ListViewConfig, WithViewKey {
  type: 'table';
}

export interface DetailViewConfigWithType
  extends DetailViewConfig,
    WithViewKey {
  type: 'detail';
}

export interface EditViewConfigWithType extends EditViewConfig, WithViewKey {
  type: 'edit';
}

export interface NewViewConfigWithType extends NewViewConfig, WithViewKey {
  type: 'new';
}

export interface RawViewConfigWithType extends RawViewConfig, WithViewKey {
  type: 'raw';
}

export type SingleRecordViewConfigWithType =
  | DetailViewConfigWithType
  | EditViewConfigWithType
  | NewViewConfigWithType;

export type ViewConfigWithType =
  | ListViewConfigWithType
  | SingleRecordViewConfigWithType
  | RawViewConfigWithType;

export const isTableViewConfig = (
  view?: ViewConfigWithType
): view is ListViewConfigWithType => {
  if (view == null) {
    return false;
  }
  return view.type === 'table';
};

export const isSingleRecordViewConfig = (
  view?: ViewConfigWithType
): view is SingleRecordViewConfigWithType => {
  if (view == null) {
    return false;
  }
  return view.type === 'detail' || view.type === 'edit' || view.type === 'new';
};


export enum DiffEditMode {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}
