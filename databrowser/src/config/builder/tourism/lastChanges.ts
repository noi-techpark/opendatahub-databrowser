// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { PropertyConfig } from '@/domain/datasets/config/types';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

interface LastChangesCellOptions {
  class?: string;
}

export const lastChangesCell = (
  options?: LastChangesCellOptions
): PropertyConfig => {
  const params: Record<string, string> = { format: DEFAULT_DATE_TIME_FORMAT };
  if (options?.class != null) {
    params.class = options.class;
  }
  return {
    title: 'Last Changes',
    component: CellComponent.EditedDateCell,
    objectMapping: { date: 'LastChange' },
    params,
  };
};

export const lastChangesTableCell = (): PropertyConfig => ({
  title: 'Edited',
  component: CellComponent.EditedDateCell,
  class: 'w-48',
  objectMapping: { date: 'LastChange' },
  params: { format: DEFAULT_DATE_TIME_FORMAT },
});
