// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const DEPRECATION_SENTENCE =
  'This dataset is currently deprecated and not being updated.';

// Replacement datasets, keyed by a lowercased fragment of the dataset name.
// The name is used instead of the id because ids differ between testing and
// production. A dataset matches when its normalized name contains the key.
const REPLACEMENTS: Record<string, { url: string; label: string }> = {
  'e-charging stations by neogy': {
    url: 'https://databrowser.opendatahub.com/dataset-overview/378092cc-1b5e-445e-ad50-075628458d07',
    label: 'New E-charging stations by Neogy-AMPECO',
  },
  'e-charging plugs by neogy': {
    url: 'https://databrowser.opendatahub.com/dataset-overview/db24af5e-1bd0-498e-952d-24d5153b90da',
    label: 'New E-charging plugs by Neogy-AMPECO',
  }
  // 'e-charging stations by driwe': {
  //   url: 'https://databrowser.opendatahub.com/dataset-overview/db24af5e-1bd0-498e-952d-24d5153b90da',
  //   label: 'New E-charging stations by DRIWE-OCPI',
  // },
};

// Names can contain double spaces, so whitespace is normalized before lookup.
const normalize = (name: string) =>
  name.replace(/\s+/g, ' ').trim().toLowerCase();

// Returns the replacement for a deprecated dataset, or undefined when the
// dataset is not deprecated or has no known replacement.
export const getReplacement = (dataset: {
  shortname: string;
  deprecated?: boolean;
}) => {
  if (!dataset.deprecated) return undefined;
  const name = normalize(dataset.shortname ?? '');

  // TEMP: remove once the key matches
  console.log('[deprecation] shortname seen:', JSON.stringify(name));

  const key = Object.keys(REPLACEMENTS).find((k) => name.includes(k));
  return key ? REPLACEMENTS[key] : undefined;
};

// The notice already shows the deprecation sentence, so it is removed from the
// displayed description to avoid repeating it. The stored description is not
// changed, because the website still reads the sentence.
export const getDisplayDescription = (dataset: {
  deprecated?: boolean;
  description?: string;
}) => {
  const text = (dataset.description ?? '').trim();
  if (!dataset.deprecated) return text;
  return text.startsWith(DEPRECATION_SENTENCE)
    ? text.slice(DEPRECATION_SENTENCE.length).trim()
    : text;
};
