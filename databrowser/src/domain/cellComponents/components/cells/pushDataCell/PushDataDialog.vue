<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="isOpen">
    <template #title>
      <div class="mr-1 text-sm font-bold text-black md:w-auto md:text-xl">
        {{ t('components.pushData.dialog.title', { title: payload.title ?? '' }) }}
      </div>
    </template>
    <template #body>
      <div>
        <div v-if="payload.publishers.length === 0" class="mb-6 flex flex-col gap-2">
          <div>
            {{ t('components.pushData.dialog.noPublishersAvailable') }}
          </div>
          <div>
            {{ t('components.pushData.dialog.contactSupport1') }}
            <a :href="`mailto:${t('contact.emailSupport')}`">
              {{ t('components.pushData.dialog.contactSupport2') }}
            </a>
          </div>
        </div>

        <div v-else>
          <div class="mb-3">
            {{ t('components.pushData.dialog.selectChannel') }}
          </div>

          <PublisherSelection
            class="mb-3"
            :publishers="payload.publishers"
            :disabled="isPushed"
            @selection-change="selectedPublishers = $event"
          />

          <div class="mb-5">
            {{ t('components.pushData.dialog.pushSendImmediately') }}
          </div>


          <ButtonCustom
            :tone="Tone.primary"
            :size="Size.sm"
            :disabled="selectedPublishers.length === 0 || isPushed"
            class="mb-2 w-full font-semibold"
            @click="confirm"
          >
            {{
              isPushed
                ? t('components.pushData.dialog.buttonAfterSend')
                : t('components.pushData.dialog.buttonBeforeSend')
            }}
          </ButtonCustom>
          <ButtonCustom 
            :variant="Variant.ghost" 
            :size="Size.sm"
            class="mb-6 w-full font-semibold" 
            @click="close"
          >
            {{ t('components.pushData.dialog.buttonCancel') }}
          </ButtonCustom>

          <PushResult :push-results="publishersWithPushResponse" />
        </div>
        <LastPushInfo
          v-if="payload.id != null"
          :id="payload.id"
          :push-results="publishersWithPushResponse"
        />
      </div>
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Size,Tone,Variant } from '@/components/button/types';
import DialogCustom from '@/components/dialog/DialogCustom.vue';
import PublisherSelection from '@/domain/cellComponents/components/cells/pushDataCell/PublisherSelection.vue'
import { PushDialogPayload } from '@/domain/datasets/ui/tableView/types';
import LastPushInfo from './LastPushInfo.vue';
import PushResult from './PushResult.vue';
import { useSendPushNotifications } from './pushNotification';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { Publisher } from './types';

const { closePushDialog } = useTableViewStore();
const { t } = useI18n();

defineProps<{ 
  isOpen: boolean;  
  payload: PushDialogPayload
}>();

const close = () => {
  closePushDialog();
};
const confirm = () => {
  sendPushes();
  if(publishersWithPushResponse.value.length > 0){
    close();
  }
};

onKeyStroke('y', () => {
  confirm();
});
onKeyStroke('n', () => {
  close();
});

const selectedPublishers = ref<Publisher[]>([]);

// Handle push sending
const { isPushed, publishersWithPushResponse, sendPushes } = useSendPushNotifications(selectedPublishers);
</script>
