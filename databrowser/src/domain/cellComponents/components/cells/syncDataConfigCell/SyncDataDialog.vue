<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="isOpen">
    <template #title>
      <div class="mr-1 text-sm font-bold text-black md:w-auto md:text-xl">
        {{ t('components.syncData.dialog.title', { title: payload.title ?? '' }) }}
      </div>
    </template>
    <template #body>
      <div class="mb-5">
        {{ t('components.syncData.dialog.description', { title: payload.title ?? '' }) }}
      </div>
      <ButtonCustom @click="confirm">
        {{ t('components.syncData.dialog.buttonBeforeSend') }}
      </ButtonCustom>
      <ButtonCustom :variant="Variant.ghost" @click="close">
        {{ t('components.syncData.dialog.buttonCancel') }}
      </ButtonCustom>

      <LastSyncInfo
        :id="payload.id"
      />
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Variant } from '@/components/button/types';
import DialogCustom from '@/components/dialog/DialogCustom.vue';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { SyncDialogPayload } from '@/domain/datasets/ui/tableView/types';
import LastSyncInfo from './LastSyncInfo.vue';

const { closeSyncDialog } = useTableViewStore();
const { t } = useI18n();

defineProps<{ 
  isOpen: boolean;  
  payload: SyncDialogPayload
}>();

const close = () => {
  closeSyncDialog();
};
const confirm = () => {
  console.log("TODO: handle sync confirm")
  close();
};

onKeyStroke('y', () => {
  confirm();
});

onKeyStroke('n', () => {
  close();
});
</script>
