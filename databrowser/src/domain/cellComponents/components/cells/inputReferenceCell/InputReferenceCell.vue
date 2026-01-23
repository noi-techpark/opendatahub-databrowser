<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <LoadingState :is-loading="isLoading" :is-error="isError" :error="error" />
    <SelectCustom
      v-if="isWriteable && isSuccess"
      :model-value="value"
      :options="options"
      :show-empty-value="showEmptyValue"
      @update:model-value="change"
    />
    <span v-if="!isWriteable && !isLoading">
      {{ options.find((option) => option.value === value)?.label ?? value }}
      <small v-if="showid" class="text-2xs">{{ value }}</small>
    </span>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import LoadingState from '../../../../../components/loading/LoadingState.vue';
import SelectCustom from '../../../../../components/select/SelectCustom.vue';
import { SelectValue } from '../../../../../components/select/types';
import {
  useRemoteSelectOptionsWithMapper,
  withSelectors,
} from '../../utils/remoteSelectOptions/useRemoteSelectOptions';
import { useWriteable } from '../../utils/writeable/useWriteable';

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{
    url: string;
    value?: SelectValue;
    keySelector?: string;
    labelSelector?: string;
    sortByLabel?: boolean;
    showEmptyValue?: boolean;
    editable?: boolean;
    readonly?: string | boolean;
    showid?: boolean;
  }>(),
  {
    value: undefined,
    keySelector: undefined,
    labelSelector: undefined,
    sortByLabel: true,
    showEmptyValue: false,
    editable: true,
    readonly: false,
    showid: false,
  }
);

const {
  url,
  keySelector,
  labelSelector,
  value,
  sortByLabel,
  showEmptyValue,
  editable,
  readonly,
  showid,
} = toRefs(props);

const isWriteable = useWriteable({ editable, readonly });

const { isLoading, isSuccess, isError, error, options } =
  useRemoteSelectOptionsWithMapper(
    url,
    sortByLabel,
    withSelectors(keySelector, labelSelector)
  );

const change = (value: SelectValue | undefined) =>
  emit('update', { prop: 'value', value });
</script>
