<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="true">
    <template #title>
      {{
        t('datasets.listView.toolBox.columnConfiguration.dialog.save.title', {
          title: configTitle,
        })
      }}
    </template>
    <template #description>
      <div>
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.save.description1'
          )
        }}
      </div>
      <div class="mt-5 font-bold">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.save.description2'
          )
        }}
      </div>
    </template>
    <template #body>
      <ButtonCustom @click="emit('saveConfirmed')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.save.buttonYes'
          )
        }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="emit('saveCancelled')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.save.buttonNo'
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

const emit = defineEmits<(event: 'saveConfirmed' | 'saveCancelled') => void>();

onKeyStroke('y', () => emit('saveConfirmed'));

onKeyStroke('n', () => emit('saveCancelled'));
</script>
