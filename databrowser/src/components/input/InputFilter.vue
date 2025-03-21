<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <InputCustom
    :id="id"
    :model-value="modelValue"
    :disabled="disabled"
    input-classes="w-full"
    :placeholder="t('components.inputFilter.labelPlaceholder')"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import InputCustom from './InputCustom.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);

withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
    focus?: boolean;
    id?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    focus: undefined,
    id: undefined,
  }
);
</script>
