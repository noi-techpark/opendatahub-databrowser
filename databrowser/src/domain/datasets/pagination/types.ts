// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface Pagination {
  totalItems: number;
  pageCount: number;
  pageSize: number;
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  hasPagination: boolean;
}

export interface WithTourismPagination<T = unknown> {
  CurrentPage: number;
  TotalResults: number;
  TotalPages: number;
  PreviousPage: string | null | undefined;
  NextPage: string | null | undefined;
  Items: T[];
}

export const hasTourismPaginationShape = (arg: unknown) => {
  if (arg == null) {
    return false;
  }
  const data = arg as WithTourismPagination;
  return (
    data.TotalResults != null && data.TotalPages != null && data.Items != null
  );
};

export const isWithTourismPagination = <T = unknown>(
  arg: unknown
): arg is WithTourismPagination<T> => {
  return hasTourismPaginationShape(arg);
};

export interface WithMobilityPagination<T = unknown> {
  limit: number;
  offset: number;
  data: T[];
}

export const isWithMobilityPagination = <T = unknown>(
  data: unknown
): data is WithMobilityPagination<T> =>
  data != null &&
  (data as WithMobilityPagination).limit != null &&
  (data as WithMobilityPagination).offset != null &&
  (data as WithMobilityPagination).data != null;

export const isWithArrayPagination = <T = unknown>(
  data: unknown
): data is T[] => Array.isArray(data);
