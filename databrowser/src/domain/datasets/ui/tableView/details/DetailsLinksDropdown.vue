<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopover :size="5" :icon-size="5">
    <template #trigger>
      <ButtonCustom
        variant="ghost"
        size="xs"
        class="flex h-10 w-11 flex-col items-center p-1 text-green-400"
      >
        <IconThreeDots class="grow stroke-current" />
        <span class="text-3xs uppercase">
          {{ t('datasets.listView.viewLinks.actions.short') }}
        </span>
      </ButtonCustom>
    </template>

    <PopoverCustomPanel :hasCloseButton="false" v-slot="{ close }" class="w-48">
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
        @click="emitEvent('push', close)"
      >
        <IconPush class="text-green-500" />
        <div>Push</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('duplicate', close)"
      >
        <IconCopy class="text-green-500" />
        <div>Duplicate</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        :disabled="true"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('openAnalytics', close)"
      >
        <div>Open in Analytics</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        :disabled="true"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('openQuality', close)"
      >
        <div>Open in Data Quality</div>
      </PopoverContent>
      <template v-if="showDelete">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('delete', close)"
        >
          <IconClose class="size-7 text-delete" />
          <div>Delete</div>
        </PopoverContent>
      </template>
    </PopoverCustomPanel>
  </ThreeDotsPopover>
</template>

<script setup lang="ts">
import PopoverCustomPanel from '@/components/popover/PopoverCustomPanel.vue';
import PopoverContentDivider from '@/components/popover/PopoverContentDivider.vue';
import PopoverContent from '@/components/popover/PopoverContent.vue';
import IconCopy from '@/components/svg/IconCopy.vue';
import IconPush from '@/components/svg/IconPush.vue';
import ThreeDotsPopover from '@/components/popover/ThreeDotsPopover.vue';
import IconThreeDots from '@/components/svg/IconThreeDots.vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import IconReload from '@/components/svg/IconReload.vue';
import IconClose from '@/components/svg/IconClose.vue';
import { RecordId } from '@/domain/datasets/types.ts';

const { t } = useI18n();

withDefaults(
  defineProps<{
    id: RecordId;
    showDelete?: boolean;
  }>(),
  {
    showDelete: true
  }
);

const emit = defineEmits([
  'duplicate',
  'refresh',
  'sync',
  'push',
  'openAnalytics',
  'openQuality',
  'delete',
]);

const emitEvent = (
  event:
    | 'duplicate'
    | 'refresh'
    | 'sync'
    | 'push'
    | 'openAnalytics'
    | 'openQuality'
    | 'delete',
  closePopup: () => void
) => {
  emit(event);
  closePopup();
};
</script>
