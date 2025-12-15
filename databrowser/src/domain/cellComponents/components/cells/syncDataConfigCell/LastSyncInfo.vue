<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="mt-2 flex flex-col gap-2">
    <div class="flex flex-col rounded bg-dialog p-2 text-white">
      <div class="flex items-center gap-1">
        <IconInfo class="w-7" />
        <div class="font-semibold">
          {{ t('components.syncData.lastSyncInfo.title') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import IconInfo from '@/components/svg/IconInfo.vue';
const { t } = useI18n();

</script>
