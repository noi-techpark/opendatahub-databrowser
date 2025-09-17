<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopover :size="5" :icon-size="5">
    <template #trigger="{ open }">
      <DatasetHeaderButton
        :handler="()=>{ }"
        :label="t('datasets.header.actions')"
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
        <div>Refresh</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('sync', close)"
      >
        <IconReload class="text-green-500" />
        <div>Force Sync</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="openAnalytics"
      >
        <IconExternal class="h-4 text-green-500"/>
        <div>Open in Analytics</div>
      </PopoverContent>
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
import DatasetHeaderButton from '@/domain/datasets/ui/header/DatasetHeaderButton.vue';
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

const openAnalytics = () => {
  window.open('https://analytics.opendatahub.com/', '_blank');
}
</script>
