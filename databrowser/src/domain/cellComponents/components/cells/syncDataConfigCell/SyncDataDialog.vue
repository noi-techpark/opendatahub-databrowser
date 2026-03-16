<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="isOpen" @close="close">
    <template #title>
      <div class="mr-1 text-sm font-bold text-black md:w-auto md:text-xl">
        {{ t('components.syncData.dialog.title', { title: payload.title ?? '' }) }}
      </div>
    </template>
    <template #body>
      <div class="mb-5">
        {{ t('components.syncData.dialog.description', { title: payload.title ?? '' }) }}
      </div>
      <ButtonCustom
        :tone="Tone.primary"
        :size="Size.sm"
        :disabled="isSynced"
        class="mb-2 w-full font-semibold"
        @click="confirm"
      >
        {{
          isSynced
            ? t('components.syncData.dialog.buttonAfterSend')
            : t('components.syncData.dialog.buttonBeforeSend')
        }}
      </ButtonCustom>
      <ButtonCustom
        :variant="Variant.ghost"
        :size="Size.sm"
        class="mb-6 w-full font-semibold"
        @click="close"
      >
        {{ t('components.syncData.dialog.buttonCancel') }}
      </ButtonCustom>

      <SyncResult v-if="syncResponse" :sync-response="syncResponse" />

      <LastSyncInfo :id="payload.id" />
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Size, Tone, Variant } from '@/components/button/types';
import DialogCustom from '@/components/dialog/DialogCustom.vue';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { SyncDialogPayload } from '@/domain/datasets/ui/tableView/types';
import LastSyncInfo from './LastSyncInfo.vue';
import SyncResult from './SyncResult.vue';
import { useSync } from '@/domain/cellComponents/components/cells/syncDataConfigCell/useSync';

const { closeSyncDialog } = useTableViewStore();
const { t } = useI18n();

const props = defineProps<{
  isOpen: boolean;
  payload: SyncDialogPayload
}>();

const close = () => {
  closeSyncDialog();
};
const confirm = () => {
  sendSync(props.payload.type, props.payload.id);
};

// Handle sync sending
const { isSynced, syncResponse, sendSync } = useSync();

// Auto-close dialog after 2 seconds on success
watch(syncResponse, (res) => {
  if (res?.response.success) {
    setTimeout(close, 2000);
  }
});

onKeyStroke('y', () => {
  if (!isSynced.value) {
    confirm();
  }
});

onKeyStroke('n', () => {
  close();
});
</script>
