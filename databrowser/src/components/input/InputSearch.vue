<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <InputWithButton
    :id="id"
    :model-value="modelValue"
    :disabled="disabled"
    :focus="focus"
    :label-placeholder="
      placeholder ?? t('components.inputSearch.labelPlaceholder')
    "
    :label-button="t('components.inputSearch.labelButton')"
    :show-icon-in-button="false"
    :show-button-text-mobile="true"
    :show-confirm-button="showConfirmButton"
    show-icon
    @update:model-value="emit('update:modelValue', $event)"
    @confirmed-value="emit('search', $event)"
  >
    <template #icon>
      <IconSearch class="size-6 text-green-500" />
    </template>
  </InputWithButton>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import IconSearch from '../svg/IconSearch.vue';
import InputWithButton from './InputWithButton.vue';

const { t } = useI18n();

const emit = defineEmits(['search', 'update:modelValue']);

withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
    focus?: boolean;
    id?: string;
    showConfirmButton?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    focus: undefined,
    id: undefined,
    showConfirmButton: false,
    placeholder: undefined,
  }
);
</script>
