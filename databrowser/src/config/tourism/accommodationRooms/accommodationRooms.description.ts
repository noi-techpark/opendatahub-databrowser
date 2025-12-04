// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { DatasetDescription } from '../../../domain/datasets/config/types';

export const accommodationRoomsDescription: DatasetDescription = {
  title: 'Accommodation Rooms',
  subtitle: 'This dataset contains rooms for tourism accommodations.',
  description:
    'On the Accommodations Endpoint it is possible to get Rooms provided by HGV and LTS. They are available also in the AlpineBits format. Please note that to properly show the data included in this dataset, the ID of an accomodation should be included in the request as parameter.',
};
