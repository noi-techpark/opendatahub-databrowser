// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref, computed, useAttrs } from 'vue';
import { useEditStore } from '../../../../datasets/ui/editView/store/editStore';

// Allows configuring exceptions where a source value should be expanded
// to a broader list of sources when filtering a lookup, e.g. params:
// { sourceOverrideFrom_001: 'noi', sourceOverrideTo_001: 'noi,nobis,eurac' }
export const useSourceOverride = (): { resolvedSource: Ref<string | null> } => {
  const editStore = useEditStore();
  const attrs = useAttrs();

  const sourceOverrides = computed(() =>
    Object.entries(attrs)
      .filter(([key]) => key.startsWith('sourceOverrideFrom_'))
      .reduce<Record<string, string>>((previous, [key, from]) => {
        const suffix = key.substring('sourceOverrideFrom_'.length);
        const to = attrs[`sourceOverrideTo_${suffix}`];

        if (typeof from !== 'string' || typeof to !== 'string') {
          return previous;
        }

        return { ...previous, [from]: to };
      }, {})
  );

  const source = computed(() => {
    const current = editStore.current as Record<string, unknown>;
    return typeof current?.Source === 'string' && current.Source.length > 0
      ? current.Source
      : null;
  });

  const resolvedSource = computed(() => {
    if (source.value == null) return null;
    return sourceOverrides.value[source.value] ?? source.value;
  });

  return { resolvedSource };
};
