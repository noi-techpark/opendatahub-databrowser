<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
<!--  <InputWithButton-->
<!--      :id="id"-->
<!--      :model-value="modelValue"-->
<!--      :disabled="disabled"-->
<!--      :focus="focus"-->
<!--      :label-button="t('components.inputFilter.labelButton')"-->
<!--      :label-placeholder="t('components.inputFilter.labelPlaceholder')"-->
<!--      @update:model-value="emit('update:modelValue', $event)"-->
<!--      @confirmed-value="emit('filter', $event)"-->
<!--  >-->
<!--    <template #icon>-->
<!--      <IconFilter />-->
<!--    </template>-->
<!--  </InputWithButton>-->
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
import InputCustom from "@/components/input/InputCustom.vue";

const { t } = useI18n();

// const emit = defineEmits(['update:modelValue']);
const emit = defineEmits(['filter', 'update:modelValue']);

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
