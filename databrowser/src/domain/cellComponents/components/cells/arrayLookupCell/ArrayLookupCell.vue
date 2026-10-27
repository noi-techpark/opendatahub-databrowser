<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="items">
    <!-- eslint-disable-next-line vue/no-template-shadow -->
    <template #table="{ items }">
      <LoadingState
        :is-loading="isLoading"
        :is-error="isError"
        :error="error"
      />
      <ArrayLookupTable
        v-if="isSuccess || !enabledValue"
        :options="options"
        :items="items"
        :unique="enableUniqueValue"
        :add-label="props.addLabel"
        :show-url="booleanOrStringToBoolean(props.showUrl, true)"
        :no-options-available-label="props.noOptionsAvailableLabel"
        :enabled="enabledValue"
        :disabled-label="props.disabledLabel"
      />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { MaybeRef, computed, toRefs, toValue } from 'vue';
import LoadingState from '../../../../../components/loading/LoadingState.vue';
import { useDatasetBaseInfoStore } from '../../../../datasets/config/store/datasetBaseInfoStore';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import EditListCell from '../../utils/editList/EditListCell.vue';
import { useRemoteSelectOptionsWithMapper } from '../../utils/remoteSelectOptions/useRemoteSelectOptions';
import ArrayLookupTable from './ArrayLookupTable.vue';

const props = withDefaults(
  defineProps<{
    lookupUrl?: string;
    keySelector?: string;
    labelSelector?: string;
    items?: string[] | null;
    unique?: boolean | string;
    addLabel?: string;
    showUrl?: boolean | string;
    noOptionsAvailableLabel?: string;
    enabled?: boolean | string;
    disabledLabel?: string;
  }>(),
  {
    items: () => [],
    unique: false,
    addLabel: 'Add new item',
    showUrl: true,
    noOptionsAvailableLabel: 'No items are available for assignment',
    enabled: true,
    disabledLabel:
      'No items are available for assignment, choose a source first',
  }
);

const enableUniqueValue = computed(() =>
  booleanOrStringToBoolean(props.unique, false)
);

const enabledValue = computed(() =>
  booleanOrStringToBoolean(props.enabled, true)
);

const { lookupUrl, keySelector, labelSelector } = toRefs(props);

const optionMapper =
  (
    keySelector: MaybeRef<string | undefined>,
    labelSelector: MaybeRef<string | undefined>
  ) =>
  (items: unknown[]) => {
    const keySelectorValue = toValue(keySelector);
    const labelSelectorValue = toValue(labelSelector);

    if (keySelectorValue == null || labelSelectorValue == null) {
      return [];
    }

    const { extractValueByPath } = useDatasetBaseInfoStore();

    return items.map((item) => {
      const value = extractValueByPath(item, keySelectorValue) as string;
      const label =
        (extractValueByPath(item, labelSelectorValue) as string) ?? value;
      const url = extractValueByPath(item, 'Url') as string;
      return { value, label, url };
    });
  };

const { options, error, isLoading, isSuccess, isError } =
  useRemoteSelectOptionsWithMapper(
    lookupUrl,
    true,
    optionMapper(keySelector, labelSelector),
    enabledValue
  );
</script>
