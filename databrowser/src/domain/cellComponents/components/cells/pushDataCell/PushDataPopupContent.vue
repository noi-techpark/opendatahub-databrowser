<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div class="mr-1 mb-2 text-sm font-bold text-black md:w-auto md:text-base">
      {{ t('components.pushData.popup.title') }}
    </div>

    <div v-if="publishers.length === 0" class="mb-6 flex flex-col gap-2">
      <div>
        {{ t('components.pushData.popup.noPublishersAvailable') }}
      </div>
      <div>
        {{ t('components.pushData.popup.contactSupport1') }}
        <a :href="`mailto:${t('contact.emailSupport')}`">
          {{ t('components.pushData.popup.contactSupport2') }}
        </a>
      </div>
    </div>

    <div v-else>
      <div class="mb-4">
        {{ t('components.pushData.popup.selectChannel') }}
      </div>

      <PublisherSelection
        class="mb-5"
        :publishers="publishers"
        :disabled="isPushed"
        @selection-change="selectedPublishers = $event"
      />

      <div class="mb-5">
        {{ t('components.pushData.popup.pushSendImmediately') }}
      </div>

      <ButtonCustom
        :variant="Variant.ghost"
        :tone="Tone.primary"
        :disabled="selectedPublishers.length === 0 || isPushed"
        class="mb-4 w-full"
        @click="sendPushes"
      >
        {{
          isPushed
            ? t('components.pushData.popup.buttonAfterSend')
            : t('components.pushData.popup.buttonBeforeSend')
        }}
      </ButtonCustom>

      <PushResult :push-results="publishersWithPushResponse" />
    </div>
    <LastPushInfo
      v-if="id != null"
      :id="id"
      :push-results="publishersWithPushResponse"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Tone, Variant } from '../../../../../components/button/types';
import LastPushInfo from './LastPushInfo.vue';
import PublisherSelection from './PublisherSelection.vue';
import PushResult from './PushResult.vue';
import { useSendPushNotifications } from './pushNotification';
import { Publisher } from './types';

const { t } = useI18n();

defineProps<{ id?: string; publishers: Publisher[] }>();

const selectedPublishers = ref<Publisher[]>([]);

// Handle push sending
const { isPushed, publishersWithPushResponse, sendPushes } =
  useSendPushNotifications(selectedPublishers);
</script>
