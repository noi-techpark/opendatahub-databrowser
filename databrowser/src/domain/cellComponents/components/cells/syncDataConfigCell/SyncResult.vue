<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-col rounded p-2 text-white"
      :class="[
        syncResponse.response.success ? 'bg-hint-info' : 'bg-hint-error',
      ]"
    >
      <div class="flex items-center gap-1">
        <IconCheckCircle v-if="syncResponse.response.success" class="w-7" />
        <IconExclamationMark v-else class="w-7" />
        <div class="font-semibold">
          {{
            syncResponse.response.success
              ? t('components.syncData.result.successTitle')
              : t('components.syncData.result.errorTitle')
          }}
        </div>
      </div>
      <div v-if="!syncResponse.response.success" class="ml-8">
        {{ syncResponse.response.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import IconCheckCircle from '@/components/svg/IconCheckCircle.vue';
import IconExclamationMark from '@/components/svg/IconExclamationMark.vue';
import { SyncResponse } from './types';

const { t } = useI18n();

defineProps<{ syncResponse: SyncResponse }>();
</script>
