// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, Ref, computed, toValue, unref } from 'vue';
import { SelectOption } from '../../../../../components/select/types';
import { unwrapData } from '../../../../api/dataExtraction';
import { useApiRead } from '../../../../api/useApi';
import { useDatasetBaseInfoStore } from '../../../../datasets/config/store/datasetBaseInfoStore';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';

export const fromStringArray = (items: string[]) => {
  return items.map((item) => {
    return { value: item, label: item };
  });
};

export const withSelectors = (
  keySelector: MaybeRef<string | undefined>,
  labelSelector: MaybeRef<string | undefined>
) => {
  const { extractValueByPath } = useDatasetBaseInfoStore();

  // Return mapping function
  return (items: Record<string, string>[]) => {
    const keySelectorValue = toValue(keySelector);
    const labelSelectorValue = toValue(labelSelector);
    if (keySelectorValue == null || labelSelectorValue == null) {
      return [];
    }

    return items.map<SelectOption>((item) => {
      const value = extractValueByPath(item, keySelectorValue) as string;
      const label =
        (extractValueByPath(item, labelSelectorValue) as string) ?? value;
      return { value, label };
    });
  };
};

export const useRemoteSelectOptionsWithMapper = <
  T extends SelectOption = SelectOption,
  D = unknown,
>(
  url: MaybeRef<string | undefined>,
  sortByLabel: MaybeRef<string | boolean | undefined>,
  mapper: MaybeRef<(items: D[]) => T[]>
): {
  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  isError: Ref<boolean>;
  error: Ref<unknown>;
  options: Ref<T[]>;
} => {
  const { data, isLoading, isSuccess, isError, error } =
    useApiRead<unknown>(url);

  const options = computed(() => {
    if (data.value == null) {
      return [];
    }

    const mapperFn = unref(mapper);
    const result = mapperFn(unwrapData(data.value));

    const sortByLabelValue = booleanOrStringToBoolean(
      toValue(sortByLabel),
      true
    );

    if (sortByLabelValue) {
      result.sort((a, b) => a.label?.localeCompare(b.label));
    }

    return result;
  });

  return { isLoading, isSuccess, isError, error, options };
};
