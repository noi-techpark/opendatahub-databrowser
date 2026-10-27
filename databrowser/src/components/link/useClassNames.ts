// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, Ref } from 'vue';
import { Tone, Variant } from './types';

const toneClass: Record<Tone, string> = {
  ['primary']: 'text-green-500',
  ['text']: 'text-gray-900',
  ['white']: 'text-white',
  ['none']: '',
};

const variantClass: Record<Variant, string> = {
  ['no-underline']: 'no-underline',
  ['underline']: 'underline',
  ['hover-underline']: 'hover-underline',
};

export const useClassNames = (tone: Ref<Tone>, variant: Ref<Variant>) =>
  computed(() => [
    'rounded-sm',
    toneClass[tone.value],
    variantClass[variant.value],
  ]);
