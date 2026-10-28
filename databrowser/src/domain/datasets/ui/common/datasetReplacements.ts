// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const DEPRECATION_SENTENCE =
  'This dataset is currently deprecated and not being updated.';

// Replacement datasets, keyed by the lowercased dataset name. The name is used
// instead of the id because ids differ between testing and production.
const REPLACEMENTS: Record<string, { url: string; label: string }> = {
  'e-charging station': {
    url: 'https://databrowser.opendatahub.com/dataset-overview/378092cc-1b5e-445e-ad50-075628458d07',
    label: 'New E-charging station dataset',
  },
  'e-charging plug': {
    url: 'https://databrowser.opendatahub.com/dataset-overview/db24af5e-1bd0-498e-952d-24d5153b90da',
    label: 'New E-charging plug dataset',
  },
};

// Names can contain double spaces, so whitespace is normalized before lookup.
const normalize = (name: string) =>
  name.replace(/\s+/g, ' ').trim().toLowerCase();

export const getReplacement = (dataset: {
  shortname: string;
  deprecated?: boolean;
}) =>
  dataset.deprecated ? REPLACEMENTS[normalize(dataset.shortname)] : undefined;

// The notice already shows the deprecation sentence, so it is removed from the
// displayed description to avoid repeating it. The stored description is not
// changed, because the website still read the sentence.
export const getDisplayDescription = (dataset: {
  shortname: string;
  deprecated?: boolean;
  description?: string;
}) => {
  const text = (dataset.description ?? '').trim();
  if (!getReplacement(dataset)) return text;
  return text.startsWith(DEPRECATION_SENTENCE)
    ? text.slice(DEPRECATION_SENTENCE.length).trim()
    : text;
};
