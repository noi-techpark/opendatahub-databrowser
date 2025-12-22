<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopover :size="5" :icon-size="5">
    <template #trigger>
      <div
        class="flex h-10 w-11 flex-col items-center p-1 text-green-400 select-none transition border border-lightgray rounded hover:bg-green-400/10 hover:border-green-400">
        <IconThreeDots class="grow stroke-current" />
        <span class="text-3xs uppercase">
          {{ t('datasets.listView.viewLinks.actions.short') }}
        </span>
      </div>
    </template>

    <PopoverCustomPanel :hasCloseButton="false" v-slot="{ close }" class="w-48">
      <PopoverContent
        v-if="showEdit"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('edit', close)"
      >
        <IconEdit class="text-green-500" />
        <div>{{ t('datasets.listView.viewLinks.edit.short') }}</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('refresh', close)"
      >
        <IconReload class="text-green-500" />
        <div>{{ t('datasets.listView.viewLinks.refresh.short') }}</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('sync', close)"
      >
        <IconReload class="text-green-500" />
        <div>{{ t('datasets.listView.viewLinks.forceSync.short') }}</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('push', close)"
      >
        <IconPush class="text-green-500" />
        <div>{{ t('datasets.listView.viewLinks.push.short') }}</div>
      </PopoverContent>
      <PopoverContentDivider />
      <template v-if="showDuplicate">
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('duplicate', close)"
        >
          <IconCopy class="text-green-500" />
          <div>{{ t('datasets.listView.viewLinks.duplicate.short') }}</div>
        </PopoverContent>
        <PopoverContentDivider />
      </template>
      <PopoverContent
        :disabled="true"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('openAnalytics', close)"
      >
        <div>{{ t('datasets.listView.viewLinks.openInAnalytics.short') }}</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
        :disabled="true"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('openQuality', close)"
      >
        <div>{{ t('datasets.listView.viewLinks.openInDataQuality.short') }}</div>
      </PopoverContent>
      <template v-if="showDelete">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('delete', close)"
        >
          <IconClose class="size-7 text-delete" />
          <div>{{ t('datasets.listView.viewLinks.delete.short') }}</div>
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
import IconReload from '@/components/svg/IconReload.vue';
import IconClose from '@/components/svg/IconClose.vue';
import { RecordId } from '@/domain/datasets/types';
import IconEdit from '@/components/svg/IconEdit.vue';

const { t } = useI18n();


withDefaults(
  defineProps<{
    id: RecordId;
    showDelete?: boolean;
    showEdit?: boolean;
    showDuplicate?: boolean;
  }>(),
  {
    showDelete: false,
    showEdit: false,
    showDuplicate: false
  }
);

const emit = defineEmits([
  'edit',
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
    | 'edit'
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
