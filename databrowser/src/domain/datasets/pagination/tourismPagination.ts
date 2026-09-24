// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { stringToNumber } from '../../utils/convertType';
import { defaultPageSize } from '../ui/tableView/defaultValues';
import { Pagination, WithTourismPagination } from './types';

export const tourismPagination = <T>(
  data: WithTourismPagination<T>,
  { query }: { query: Record<string, string> | undefined }
): Pagination => {
  const totalItems = data.TotalResults;
  const currentPage = data.CurrentPage;
  const pageCount = data.TotalPages;
  const hasPrevious = data.PreviousPage != null;
  const hasNext = data.NextPage != null;

  // TODO: use default page size for Tourism API
  const pageSize = stringToNumber(query?.pagesize, defaultPageSize);

  return {
    totalItems,
    pageCount,
    pageSize,
    currentPage,
    hasPrevious,
    hasNext,
    hasPagination: hasPrevious || hasNext,
  };
};
