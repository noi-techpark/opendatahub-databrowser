// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, computed, toValue } from 'vue';
import { ViewValue, ViewKey } from '../../../config/types';
import { ViewConfigWithType } from '../../types';

export const extractView = (
  baseViews: ViewValue | undefined,
  viewKey: ViewKey | undefined
): ViewConfigWithType | undefined => {
  const viewKeyValue = toValue(viewKey);
  const baseViewsValue = toValue(baseViews);
  if (viewKeyValue == null || baseViewsValue == null) {
    return undefined;
  }

  switch (viewKeyValue) {
    case 'table':
      return (
        baseViewsValue.table && {
          ...baseViewsValue.table,
          type: viewKeyValue,
        }
      );
    case 'detail':
      return (
        baseViewsValue.detail && {
          ...baseViewsValue.detail,
          type: viewKeyValue,
        }
      );
    case 'edit':
      return (
        baseViewsValue.edit && {
          ...baseViewsValue.edit,
          type: viewKeyValue,
        }
      );
    case 'new':
      return (
        baseViewsValue.new && {
          ...baseViewsValue.new,
          type: viewKeyValue,
        }
      );
    case 'raw':
      return (
        baseViewsValue.raw && {
          ...baseViewsValue.raw,
          type: viewKeyValue,
        }
      );
  }
};

export const useExtractView = (
  baseViews: MaybeRef<ViewValue | undefined>,
  viewKey: MaybeRef<ViewKey | undefined>
) => computed(() => extractView(toValue(baseViews), toValue(viewKey)));
