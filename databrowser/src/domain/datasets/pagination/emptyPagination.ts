// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { defaultPageSize } from '../ui/tableView/defaultValues';
import { Pagination } from './types';

export const emptyPagination = (): Pagination => ({
  totalItems: 0,
  pageCount: 0,
  pageSize: defaultPageSize,
  currentPage: 1,
  hasPrevious: false,
  hasNext: false,
  hasPagination: false,
});
