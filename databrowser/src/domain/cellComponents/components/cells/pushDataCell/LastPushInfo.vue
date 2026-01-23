<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="id != null" class="mt-2 flex flex-col gap-2">
    <div class="flex flex-col rounded bg-dialog p-2 text-white">
      <div class="flex items-center gap-1">
        <IconInfo class="w-7" />
        <div class="font-semibold">
          {{ t('components.pushData.lastPushInfo.title') }}
        </div>
      </div>
      <div class="ml-8">
        <LoadingIndicator v-if="isLoading" />
        <template v-else>
          <div v-if="pushResponse.state === 'error'">
            {{ pushResponse.message }}
          </div>
          <div v-if="pushResponse.state === 'info'">
            {{ pushResponse.message }}
          </div>
          <div v-if="pushResponse.state === 'ok'">
            <div>
              {{
                t('components.pushData.lastPushInfo.sentAt', {
                  date: pushResponse.dateFormatted,
                })
              }}
            </div>
            <div>
              {{
                t('components.pushData.lastPushInfo.pushResponseId', {
                  id: pushResponse.id,
                })
              }}
            </div>
          </div>
          <div v-if="isError">
            {{ t('components.pushData.lastPushInfo.error', { error }) }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LoadingIndicator from '../../../../../components/loading/LoadingIndicator.vue';
import IconInfo from '../../../../../components/svg/IconInfo.vue';
import { useLastPushResponse } from './lastPush';
import { PublisherWithPushResponse } from './types';
import { watch } from 'vue';

const { t } = useI18n();

const props = defineProps<{
  id: string;
  pushResults: PublisherWithPushResponse[];
}>();

// Fetch the last push response
const { pushResponse, isLoading, isError, error, refetch } =
  useLastPushResponse(props.id);

watch(
  () => props.pushResults,
  () => refetch()
);
</script>
