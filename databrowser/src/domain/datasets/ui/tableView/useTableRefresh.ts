// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEventBus } from '@vueuse/core';

// Event to request a reload of the table data, e.g. from the dataset header
export const useEventRefreshTable = useEventBus<void>('refresh-table');
