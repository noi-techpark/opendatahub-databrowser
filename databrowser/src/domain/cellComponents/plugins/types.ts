// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component } from 'vue';
import { CellComponent } from '../types';

export type RegisteredComponent = [
  CellComponent,
  Component,
  { supportsTableView: boolean },
];
