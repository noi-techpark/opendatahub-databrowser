<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="fixed top-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-black transition-all left-1/2"
    :class="(toolBoxStore.activeSectionKey !== ToolBoxSectionKey.NONE) ? 'left-1/2 md:left-1/3' : 'left-1/2'"
  >
    <div class="flex flex-col items-center justify-center">
      <IconEyeWithLid class="h-24 w-36" />
      <span class="text-center text-3xl font-semibold">
        {{ t('datasets.listView.noData.dataDoesNotExist') }}
      </span>
      <span class="text-center text-2xl text-dialog">
        {{ t('datasets.listView.noData.suggestion') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import IconEyeWithLid from '../../../../components/svg/IconEyeWithLid.vue';
import { useToolBoxStore } from '../toolBox/toolBoxStore';
import { ToolBoxSectionKey } from '@/domain/datasets/ui/toolBox/types';

const { t } = useI18n();

const toolBoxStore = useToolBoxStore();
</script>
