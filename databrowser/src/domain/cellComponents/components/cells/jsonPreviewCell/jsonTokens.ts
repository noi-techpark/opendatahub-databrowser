// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// Simple JSON syntax highlighting for the read-only previews in table views.

export type TokenType = 'key' | 'string' | 'number' | 'literal' | 'other';

// Colors similar to Monaco's "vs" theme
export const tokenClasses: Record<TokenType, string> = {
  key: 'text-[#a31515]',
  string: 'text-[#0451a5]',
  number: 'text-[#098658]',
  literal: 'text-[#0000ff]',
  other: 'text-gray-700',
};

// Strings followed by a colon are keys
const tokenPattern =
  /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

export const tokenize = (text: string): { text: string; type: TokenType }[] => {
  const result: { text: string; type: TokenType }[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(tokenPattern)) {
    if (match.index > lastIndex) {
      result.push({ text: text.slice(lastIndex, match.index), type: 'other' });
    }
    const [, str, colon, num, literal] = match;
    if (str != null) {
      result.push({ text: str, type: colon != null ? 'key' : 'string' });
      if (colon != null) {
        result.push({ text: colon, type: 'other' });
      }
    } else if (num != null) {
      result.push({ text: num, type: 'number' });
    } else if (literal != null) {
      result.push({ text: literal, type: 'literal' });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.slice(lastIndex), type: 'other' });
  }
  return result;
};
