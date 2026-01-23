<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="true">
    <template #title>
      {{
        t(
          'datasets.listView.toolBox.columnConfiguration.dialog.navigationGuard.title'
        )
      }}
    </template>
    <template #description>
      {{
        t(
          'datasets.listView.toolBox.columnConfiguration.dialog.navigationGuard.description'
        )
      }}
    </template>
    <template #body>
      <ButtonCustom @click="emit('saveChanges')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.navigationGuard.buttonSave'
          )
        }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="emit('discardChanges')">
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.navigationGuard.buttonDontSave'
          )
        }}
      </ButtonCustom>
      <ButtonCustom
        class="mt-2"
        :variant="Variant.ghost"
        @click="emit('cancel')"
      >
        {{
          t(
            'datasets.listView.toolBox.columnConfiguration.dialog.navigationGuard.buttonCancel'
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

const emit = defineEmits(['cancel', 'discardChanges', 'saveChanges']);

onKeyStroke('y', () => emit('saveChanges'));
onKeyStroke('n', () => emit('discardChanges'));
onKeyStroke('c', () => emit('cancel'));
</script>
