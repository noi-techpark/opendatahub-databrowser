<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="true">
    <template #title>
      {{
        t('datasets.listView.toolBox.columnConfiguration.dialog.delete.title', {
          title: configTitle,
        })
      }}
    </template>
    <template #description>
      <div>
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.delete.description1'
          )
        }}
      </div>
      <div class="mt-5 font-bold">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.delete.description2'
          )
        }}
      </div>
    </template>
    <template #body>
      <ButtonCustom @click="emit('deleteConfirmed')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.delete.buttonYes'
          )
        }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="emit('deleteCancelled')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.delete.buttonNo'
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

defineProps<{ configTitle: string }>();

const emit =
  defineEmits<(event: 'deleteConfirmed' | 'deleteCancelled') => void>();

onKeyStroke('y', () => emit('deleteConfirmed'));
onKeyStroke('n', () => emit('deleteCancelled'));
</script>
