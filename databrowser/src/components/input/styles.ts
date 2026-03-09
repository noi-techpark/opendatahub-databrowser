// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Variant } from './types';

export const variantClass: Record<Variant,string> = {
  [Variant.solid]: 'border border-lightgray rounded bg-white text-black focus-within:border-green-500 focus-within:bg-green-500/10',
  [Variant.transparent]: 'border border-lightgray rounded bg-trasparent text-black focus-within:border-green-500 focus-within:bg-green-500/10'
};


export const computeInputWrapperClasses = ({
  variant = Variant.solid
}: {
  variant?: Variant;
}) => 'flex h-11 items-center justify-between gap-2 rounded p-2 py-5 md:p-2 ' + variantClass[variant]
