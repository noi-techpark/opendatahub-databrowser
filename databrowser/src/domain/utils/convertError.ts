// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AxiosError } from 'axios';

export const toError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  } else if (typeof err === 'string') {
    return new Error(err);
  } else {
    return new Error('Unknown error', { cause: err });
  }
};


export const getAxiosErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return `(${error.response?.status}) ${error.response?.statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return error as string;
};
