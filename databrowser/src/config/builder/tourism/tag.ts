// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailElements,
  PropertyConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';

// Builds numbered sourceOverrideFrom_XXX / sourceOverrideTo_XXX params from a
// simple { from: to } map, e.g. { studiopink: 'noi,nobis,eurac,lts' } becomes
// { sourceOverrideFrom_001: 'studiopink', sourceOverrideTo_001: 'noi,nobis,eurac,lts' }.
// Consumed by useSourceOverride() in the *SourceFiltered cell components.
const buildSourceOverrideParams = (
  sourceOverrides?: Record<string, string>
): Record<string, string> =>
  Object.entries(sourceOverrides ?? {}).reduce<Record<string, string>>(
    (params, [from, to], index) => {
      const suffix = String(index + 1).padStart(3, '0');
      params[`sourceOverrideFrom_${suffix}`] = from;
      params[`sourceOverrideTo_${suffix}`] = to;
      return params;
    },
    {}
  );

export const tagCell = (
  mainentity?: string,
  options?: {
    withSourceFilter?: boolean;
    sourceOverrides?: Record<string, string>;
  }
): PropertyConfig => {
  const filterParam =
    mainentity == null
      ? ''
      : `?validforentity=${mainentity}&fields=Id,TagName&pagesize=0`;
  const url = withOdhBaseUrl('/v1/Tag') + filterParam;

  return {
    title: 'Assigned Tags',
    component: options?.withSourceFilter
      ? CellComponent.TagReferenceCellSourceFiltered
      : CellComponent.TagReferenceCell,
    arrayMapping: {
      targetPropertyName: 'items',
      pathToParent: 'TagIds',
    },
    params: {
      url,
      keySelector: 'Id',
      labelSelector: 'TagName.{language}',
      showAdditionalData: 'true',
      ...buildSourceOverrideParams(options?.sourceOverrides),
    },
  };
};

export const tagCategory = (
  mainentity?: string,
  options?: {
    withSourceFilter?: boolean;
    sourceOverrides?: Record<string, string>;
  }
): DetailElements => {
  return {
    name: 'Tags',
    slug: 'Tags',
    subcategories: [
      {
        name: '',
        properties: [tagCell(mainentity, options)],
      },
    ],
  };
};
