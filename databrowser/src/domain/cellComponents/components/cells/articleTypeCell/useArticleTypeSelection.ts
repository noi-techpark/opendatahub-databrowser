// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createEventHook } from '@vueuse/core';
import { ref, Ref, watch } from 'vue';
import { SelectOption } from '../../../../../components/select/types';

const buildSelectOptions = (options: string[]) =>
  options
    .map<SelectOption>((option) => ({ label: option, value: option }))
    .sort((a, b) => a.label.localeCompare(b.label));

export const useArticleTypeSelection = (
  type: Ref<string | undefined>,
  subType: Ref<string | undefined>,
  hierarchy: Ref<Record<string, string[] | undefined>>
) => {
  const initialType = type.value;
  const initialSubType = subType.value;

  const typeSelectOptions = ref<SelectOption[]>([]);
  const subTypeSelectOptions = ref<SelectOption[]>([]);
  const currentTypeValue = ref<string>();
  const currentSubTypeValue = ref<string>();

  const lastSelectedSubTypeForType: Record<string, string | undefined> = {};

  const updateHook = createEventHook<{
    nextType?: string;
    nextSubType?: string;
  }>();

  // If type is null / undefined, then return the current sub type. Otherwise return
  // the sub type that was used the last time for this type
  const getLastSubTypeForType = (type?: string) =>
    type == null ? undefined : lastSelectedSubTypeForType[type];

  watch(
    () => [type.value, subType.value, hierarchy.value],
    () => {
      const hasType = type.value != null;
      const hasSubType = subType.value != null;

      const isSubTypeInTypeHierarchy =
        (hasType &&
          hasSubType &&
          hierarchy.value[type.value!]?.includes(subType.value!)) ??
        false;

      // Handle select option computation for type

      typeSelectOptions.value = buildSelectOptions(
        Object.keys(hierarchy.value)
      );

      // Handle select option computation for sub type

      const subTypesForCurrentType = hierarchy.value[type.value!] ?? [];
      subTypeSelectOptions.value = buildSelectOptions(subTypesForCurrentType);

      // Store old type and sub type values

      const oldTypeValue = currentTypeValue.value;
      const oldSubTypeValue = currentSubTypeValue.value;

      // Compute current type and sub type values

      currentTypeValue.value = type.value;

      currentSubTypeValue.value =
        subType.value == null || isSubTypeInTypeHierarchy
          ? // If sub type is null / undefined or it is defined for current type, use sub type value
            subType.value
          : // Use previously set sub type if not undefined
            (lastSelectedSubTypeForType[type.value!] ??
            // If initial values are the same as current values, then just
            // use the provided sub type. This covers an edge case where
            // the initial sub type value is unknown
            (type.value === initialType && subType.value === initialSubType
              ? subType.value
              : undefined));

      // If type or sub type changed, then trigger hook
      if (
        oldTypeValue != currentTypeValue.value ||
        oldSubTypeValue != currentSubTypeValue.value
      ) {
        // The trigger will be invoked in the process of running the useArticleTypeSelection the first time,
        // but since at this point no callback can be defined on the hook (we're still initializing useArticleTypeSelection),
        // it has no (side)effect
        updateHook.trigger({
          nextType: currentTypeValue.value,
          nextSubType: currentSubTypeValue.value,
        });
      }

      if (hasType) {
        // Store sub type for current type for later reuse
        lastSelectedSubTypeForType[type.value!] = currentSubTypeValue.value;
      }
    },
    { immediate: true }
  );

  return {
    typeSelectOptions,
    subTypeSelectOptions,
    currentTypeValue,
    currentSubTypeValue,
    onUpdate: updateHook.on,
    getLastSubTypeForType,
  };
};
