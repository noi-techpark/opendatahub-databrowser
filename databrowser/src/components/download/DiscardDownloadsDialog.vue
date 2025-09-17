<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="isOpen">
    <template #title>
      {{ t('datasets.download.dialog.discardExports.title') }}
    </template>
    <template #description>
      {{ t('datasets.download.dialog.discardExports.description') }}
    </template>
    <template #body>
      <ButtonCustom @click="discard">
        {{ t('datasets.download.dialog.discardExports.buttonYes') }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="close">
        {{ t('datasets.download.dialog.discardExports.buttonNo') }}
      </ButtonCustom>
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../button/ButtonCustom.vue';
import { Variant } from '../button/types';
import DialogCustom from '../dialog/DialogCustom.vue';

const { t } = useI18n();

defineProps<{ isOpen: boolean }>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'discard'): void;
}>();

const close = () => {
  emit('close');
};

const discard = () => {
  emit('discard');
  close();
};

onKeyStroke('y', () => {
  discard();
});

onKeyStroke('n', () => {
  close();
});
</script>
