// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  PropertyConfig,
  SubCategoryElement,
} from '../../../domain/datasets/config/types';
import { lastChangesCell } from './lastChanges';
import { publishedOnCell } from './publishedOn';

interface Options {
  hasLastChanges?: boolean;
  hasVisibleInSearch?: boolean;
  hideODHActive?: boolean;
}

export const dataStatesSubCategory = (
  options?: Options
): SubCategoryElement => {
  const dataStates = {
    name: 'Data states',
    properties: [
      lastChangesCell(),
      {
        title: 'Active',
        component: CellComponent.ToggleTriStateCell,
        objectMapping: { enabled: 'Active' },
      },
      publishedOnCell(),
    ],
  };

  if (!options?.hideODHActive) {
    dataStates.properties.push({
      title: 'Active on Open Data Hub',
      component: CellComponent.ToggleTriStateCell,
      objectMapping: { enabled: 'SmgActive' },
    });
  }

  if (options?.hasVisibleInSearch) {
    dataStates.properties.push({
      title: 'Visible in Search',
      component: CellComponent.ToggleTriStateCell,
      objectMapping: { enabled: 'VisibleInSearch' },
    });
  }

  return dataStates;
};

export const dataStatesWithInsertsSubCategory = (
  inserts: { position: number; properties: PropertyConfig[] }[],
  options?: Options
): SubCategoryElement => {
  const dataStates = dataStatesSubCategory(options);
  inserts.forEach((insert) => {
    dataStates.properties.splice(insert.position, 0, ...insert.properties);
  });
  return dataStates;
};
