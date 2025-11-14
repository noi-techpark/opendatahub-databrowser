<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="true">
    <template #title>
      {{
        t('datasets.listView.toolBox.columnConfiguration.dialog.discard.title')
      }}
    </template>
    <template #description>
      <div>
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.discard.description'
          )
        }}
      </div>
    </template>
    <template #body>
      <ButtonCustom @click="emit('discardConfirmed')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.discard.buttonYes'
          )
        }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="emit('discardCancelled')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.discard.buttonNo'
          )
        }}
      </ButtonCustom>
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Variant } from '../../../../../../components/button/types';
import DialogCustom from '../../../../../../components/dialog/DialogCustom.vue';

const { t } = useI18n();

const emit =
  defineEmits<(event: 'discardConfirmed' | 'discardCancelled') => void>();

onKeyStroke('y', () => emit('discardConfirmed'));
onKeyStroke('n', () => emit('discardCancelled'));
</script>
