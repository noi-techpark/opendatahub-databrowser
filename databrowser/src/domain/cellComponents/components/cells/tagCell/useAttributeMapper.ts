// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, ref, Ref, toValue, watch } from 'vue';
import { SelectOption } from '../../../../../components/select/types';
import {
  buildOptions,
  mapToOptionsWithKeys,
  mapToOptionsWithKeysAndValues,
} from '../../utils/selectOptions/selectOptionsMapperUtils';

// The select options are provided as attributes of form
// "value_XXX" and "label_XXX"; they must be transformed in
// order to be usable by the select component
//
// Example: "value_001" with value "EC" and "label_001" with
// value "Eurac" are merged into the following SelectOption:
// {value: "EC", label: "Eurac"}
export const useAttributeMapper = (
  attrs: MaybeRef<Record<string, unknown>>,
  sortByLabel: MaybeRef<boolean>
): { options: Ref<SelectOption[]> } => {
  const options = ref<SelectOption[]>([]);

  watch(
    () => [toValue(attrs)],
    () => {
      const attrsValue = toValue(attrs);
      const sortByLabelValue = toValue(sortByLabel);

      const optionsWithKeys = mapToOptionsWithKeys(attrsValue);
      const optionsWithKeysAndValues = mapToOptionsWithKeysAndValues(
        attrsValue,
        optionsWithKeys
      );

      options.value = buildOptions(optionsWithKeysAndValues, sortByLabelValue);
    },
    { immediate: true }
  );

  return { options };
};
