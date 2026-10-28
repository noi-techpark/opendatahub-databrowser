// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// Origin used for canonical URLs, independent of the host serving the page,
// so that e.g. testing deployments point search engines to production
export const canonicalOrigin =
  import.meta.env.VITE_APP_CANONICAL_ORIGIN ||
  'https://databrowser.opendatahub.com';
