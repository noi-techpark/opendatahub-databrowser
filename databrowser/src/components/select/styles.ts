// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SelectOptionsPlacement, SelectSize } from './types';

export const selectButtonSizeStyles: Record<SelectSize, string> = {
  [SelectSize.xs]: '',
  [SelectSize.sm]: 'min-h-6',
  [SelectSize.md]: 'min-h-10',
};

export const selectOptionsSizeStyles: Record<
  SelectSize,
  Record<SelectOptionsPlacement, string>
> = {
  [SelectSize.xs]: {
    bottom: 'border-t-0 rounded-b',
    top: 'border-b-0 rounded-t bottom-6',
  },
  [SelectSize.sm]: {
    bottom: 'border-t-0 rounded-b',
    top: 'border-b-0 rounded-t bottom-6',
  },
  [SelectSize.md]: {
    bottom: 'border-t-0 rounded-b',
    top: 'border-b-0 rounded-t bottom-10',
  },
};
