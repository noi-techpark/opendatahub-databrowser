// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref, Ref, watch } from 'vue';
import { SelectOption } from '../../../../../components/select/types';
import {
  buildOptions,
  mapToOptionsWithKeys,
  mapToOptionsWithKeysAndValues,
} from '../../utils/selectOptions/selectOptionsMapperUtils';

export const useSelectOptionsMapper = (
  options: Ref<SelectOption[] | undefined>,
  attrs: Ref<Record<string, unknown>>
) => {
  const optionsInternal = ref<SelectOption[]>([]);

  watch(
    () => [options.value, attrs.value],
    () => {
      if (options.value != null) {
        optionsInternal.value = options.value;
        return;
      }

      const optionsWithKeys = mapToOptionsWithKeys(attrs.value);
      const optionsWithKeysAndValues = mapToOptionsWithKeysAndValues(
        attrs.value,
        optionsWithKeys
      );

      optionsInternal.value = buildOptions(optionsWithKeysAndValues, false);
    },
    { immediate: true }
  );

  return { optionsInternal };
};
