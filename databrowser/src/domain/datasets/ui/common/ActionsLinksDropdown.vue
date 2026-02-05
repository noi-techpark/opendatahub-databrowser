<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopover :size="5" :icon-size="5">
    <template #trigger="{ open }">
      <DatasetHeaderLink
        :label="t('datasets.header.actions.title')"
        :icon="OdhActions"
        :active="open"
      />
    </template>

    <PopoverCustomPanel :hasCloseButton="false" v-slot="{ close }" class="w-48 mt-2">
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('refresh', close)"
      >
        <IconReload class="text-green-500" />
        <div>{{ t('datasets.header.actions.refresh') }}</div>
      </PopoverContent>
<!--      <PopoverContentDivider />-->
<!--      <PopoverContent-->
<!--        with-hover-->
<!--        class="flex items-center gap-2"-->
<!--        @click="emitEvent('sync', close)"-->
<!--      >-->
<!--        <IconReload class="text-green-500" />-->
<!--        <div>{{ t('datasets.header.actions.sync') }}</div>-->
<!--      </PopoverContent>-->
      <PopoverContentDivider />
      <a
        href="https://analytics.opendatahub.com/"
        target="_blank"
        class="flex items-center gap-2 p-4 no-underline hover:bg-gray-50"
      >
        <IconExternal class="h-4 text-green-500"/>
        {{ t('datasets.header.actions.analytics') }}
      </a>
    </PopoverCustomPanel>
  </ThreeDotsPopover>
</template>

<script setup lang="ts">
import PopoverCustomPanel from '@/components/popover/PopoverCustomPanel.vue';
import PopoverContentDivider from '@/components/popover/PopoverContentDivider.vue';
import PopoverContent from '@/components/popover/PopoverContent.vue';
import ThreeDotsPopover from '@/components/popover/ThreeDotsPopover.vue';
import {useI18n} from "vue-i18n";
import IconReload from '@/components/svg/IconReload.vue';
import OdhActions from '@/components/svg/odh/OdhActions.vue';
import DatasetHeaderLink from '@/domain/datasets/ui/header/DatasetHeaderLink.vue';
import IconExternal from '@/components/svg/IconExternal.vue';

const { t } = useI18n();

const emit = defineEmits(['refresh', 'sync', 'push']);

const emitEvent = (
    event: 'refresh' | 'sync' | 'push',
    closePopup: () => void
) => {
  emit(event);
  closePopup();
};

</script>
