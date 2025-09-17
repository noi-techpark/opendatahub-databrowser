// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Size, Tone, Variant } from './types';

export const variantClass: Record<Variant, Record<Tone, string>> = {
  [Variant.solid]: {
    [Tone.primary]:
        'border border-transparent bg-green-500 text-white hover:bg-green-700 focus-visible:bg-green-700 focus-visible:outline-none',
    [Tone.danger]:
      'border border-transparent bg-red-500 text-white hover:bg-red-700 focus-visible:bg-red-700 focus-visible:outline-none',
    [Tone.white]:
      'border border-green-500 bg-white text-green-500 hover:bg-white focus-visible:bg-white focus-visible:outline-none',
  },
  [Variant.soft]: {
    [Tone.primary]:
        'border border-green-400 text-green-400 bg-green-400/10 hover:bg-green-400/30 focus-visible:bg-green-400/30 focus-visible:outline-none',
    [Tone.danger]:
      'border border-red-400 text-red-400 bg-red-400/10 hover:bg-red-400/30 focus-visible:bg-red-400/30 focus-visible:outline-none',
    [Tone.white]:
      'border border-green-400 text-green-400 bg-white/10 hover:bg-white/30 focus-visible:bg-white/30 focus-visible:outline-none',
  },
  [Variant.ghost]: {
    [Tone.primary]:
      'border text-green-500 hover:bg-green-400/10 hover:border-green-400 focus-visible:bg-green-400/10 focus-visible:text-green-500 focus-visible:border-green-400 focus-visible:outline-none',
    [Tone.danger]:
      'border text-red-500 hover:bg-red-500/10 hover:border-red-500 focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:border-red-500 focus-visible:outline-none',
    [Tone.white]:
      'border text-green-500 hover:bg-white/10 hover:border-green-500 focus-visible:bg-white/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
  },
  [Variant.transparent]: {
    [Tone.primary]:
      'focus-visible:bg-green-500/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
    [Tone.danger]:
      'focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:border-red-500 focus-visible:outline-none',
    [Tone.white]:
      'focus-visible:bg-white/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
  },
};

export const sizeClass: Record<Size, string> = {
  [Size.xs]: 'rounded leading-tight',
  [Size.xm2col]:
    'gap-3 justify-center pt-1.5 pb-1.5 pr-6 pl-2.5 w-full md:w-fit rounded leading-tight',
  [Size.sm]: 'pt-1.5 pb-1.5 px-6 rounded leading-tight',
  [Size.md]: 'pt-2.5 pb-3 px-9 rounded leading-tight',
  [Size.md2col]:
    'gap-3 justify-center pt-2.5 pb-3 pr-6 pl-2.5 w-full md:w-fit rounded leading-tight',
};

export const disabledClass: Record<Variant, Record<Tone, string>> = {
  [Variant.solid]: {
    [Tone.primary]:
        'border border-transparent bg-green-500 text-white opacity-25',
    [Tone.danger]: 'border border-transparent bg-red-500 text-white opacity-25',
    [Tone.white]: 'border border-green-500 bg-white text-green-500 opacity-25',
  },
  [Variant.soft]: {
    [Tone.primary]:
        'border border-green-500 bg-green-400/10 text-green-500 opacity-25',
    [Tone.danger]:
        'border border-red-500 bg-red-400/10 text-red-500 opacity-25',
    [Tone.white]:
        'border border-green-500 bg-white/10 text-green-500 opacity-25',
  },
  [Variant.ghost]: {
    [Tone.primary]:
        'border border-green-500 bg-transparent text-green-500 opacity-25',
    [Tone.danger]:
      'border border-red-500 bg-transparent text-red-500 opacity-25',
    [Tone.white]:
      'border border-green-500 bg-transparent text-green-500 opacity-25',
  },
  [Variant.transparent]: {
    [Tone.primary]: 'bg-transparent text-grey-500 opacity-25',
    [Tone.danger]: 'bg-transparent text-red-500 opacity-25',
    [Tone.white]: 'bg-transparent text-green-500 opacity-25',
  },
};

export const activeClass: Record<Variant, Record<Tone, string>> = {
  [Variant.solid]: {
    [Tone.primary]:
      'border border-transparent bg-green-500 text-white hover:bg-green-700 focus-visible:bg-green-700 focus-visible:outline-none',
    [Tone.danger]:
      'border border-transparent bg-red-500 text-white hover:bg-red-700 focus-visible:bg-red-700 focus-visible:outline-none',
    [Tone.white]:
      'border border-green-400 bg-white text-green-500 hover:bg-green-400/10 focus-visible:bg-green-400/10 focus-visible:outline-none',
  },
  [Variant.soft]: {
    [Tone.primary]:
      'border border-green-400 bg-green-400/10 text-gray-950 hover:bg-green-400/20 hover:border-green-500 focus-visible:bg-green-400/20 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
    [Tone.danger]:
      'border border-red-400 bg-red-400/10 text-gray-950 hover:bg-red-500/10 hover:border-red-500 focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:border-red-500 focus-visible:outline-none',
    [Tone.white]:
      'border border-green-400 bg-white/10 text-green-950 hover:bg-white-500/10 hover:border-green-500 focus-visible:bg-white-500/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
  },
  [Variant.ghost]: {
    [Tone.primary]:
      'border border-green-400 bg-green-400/10 text-gray-950 hover:bg-green-400/20 hover:border-green-500 focus-visible:bg-green-400/20 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
    [Tone.danger]:
      'border border-red-400 bg-red-400/10 text-gray-950 hover:bg-red-500/10 hover:border-red-500 focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:border-red-500 focus-visible:outline-none',
    [Tone.white]:
      'border border-green-400 bg-white-400/10 text-green-950 hover:bg-white-500/10 hover:border-green-500 focus-visible:bg-white-500/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
  },
  [Variant.transparent]: {
    [Tone.primary]:
      'focus-visible:bg-green-500/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
    [Tone.danger]:
      'focus-visible:bg-red-500/10 focus-visible:text-red-500 focus-visible:border-red-500 focus-visible:outline-none',
    [Tone.white]:
      'focus-visible:bg-white-500/10 focus-visible:text-green-500 focus-visible:border-green-500 focus-visible:outline-none',
  },
};

export const computeButtonClasses = ({
  variant = Variant.solid,
  size = Size.md,
  tone = Tone.primary,
  disabled = false,
  active = false,
}: {
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  disabled?: boolean;
  active?: boolean;
}) =>
  'inline-block ' +
  (disabled ? disabledClass[variant][tone] : (active ? activeClass[variant][tone] : variantClass[variant][tone])) +
  ' ' +
  sizeClass[size];
