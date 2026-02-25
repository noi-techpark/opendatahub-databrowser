<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopover :size="5" :icon-size="5">
    <template #trigger>
      <div
        @click="onOpen"
        class="flex h-10 w-11 flex-col items-center p-1 text-green-400 select-none transition border border-lightgray rounded hover:bg-green-400/10 hover:border-green-400">
        <IconThreeDots class="grow stroke-current" />
        <span class="text-3xs uppercase">
          {{ t('datasets.listView.viewLinks.actions.short') }}
        </span>
      </div>
    </template>

    <PopoverCustomPanel :hasCloseButton="false" v-slot="{ close }" class="w-48">
      <teleport to="body">
        <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/10 z-40"
          @click="onClose(close)"
        />
      </teleport>
      <div class="relative z-50">
        <div class="grid grid-cols-3 md:block">
          <PopoverContent
            v-if="showEdit"
            with-hover
            class="flex items-center justify-center gap-2 md:justify-start"
            @click="emitEvent('edit', close)"
          >
            <IconEdit class="text-green-500" />
            <div class="hidden md:block">{{ t('datasets.listView.viewLinks.edit.short') }}</div>
          </PopoverContent>
          <PopoverContentDivider class="hidden md:block" />
          <PopoverContent
            with-hover
            class="flex items-center justify-center gap-2 md:justify-start"
            @click="emitEvent('refresh', close)"
          >
            <IconReload class="text-green-500" />
            <div class="hidden md:block">{{ t('datasets.listView.viewLinks.refresh.short') }}</div>
          </PopoverContent>
          <PopoverContentDivider class="hidden md:block" />
          <template v-if="showForceSync">
            <PopoverContent
              with-hover
              class="flex items-center justify-center gap-2 md:justify-start"
              @click="emitEvent('sync', close)"
            >
              <OdhLoading class="text-green-500" />
              <div class="hidden md:block">{{ t('datasets.listView.viewLinks.forceSync.short') }}</div>
            </PopoverContent>
            <PopoverContentDivider class="hidden md:block" />
          </template>
          <template v-if="showPush">
            <PopoverContent
              with-hover
              class="flex items-center justify-center gap-2 md:justify-start"
              @click="emitEvent('push', close)"
            >
              <IconPush class="text-green-500" />
              <div class="hidden md:block">{{ t('datasets.listView.viewLinks.push.short') }}</div>
            </PopoverContent>
            <PopoverContentDivider class="hidden md:block" />
          </template>
          <template v-if="showDuplicate">
            <PopoverContent
              with-hover
              class="flex items-center justify-center gap-2 md:justify-start"
              @click="emitEvent('duplicate', close)"
            >
              <IconCopy class="text-green-500" />
              <div class="hidden md:block">{{ t('datasets.listView.viewLinks.duplicate.short') }}</div>
            </PopoverContent>
            <PopoverContentDivider class="hidden md:block" />
          </template>
          <!--      <PopoverContent-->
          <!--        :disabled="true"-->
          <!--        with-hover-->
          <!--        class="flex items-center gap-2"-->
          <!--        @click="emitEvent('openAnalytics', close)"-->
          <!--      >-->
          <!--        <div>{{ t('datasets.listView.viewLinks.openInAnalytics.short') }}</div>-->
          <!--      </PopoverContent>-->
          <!--      <PopoverContentDivider />-->
          <!--      <PopoverContent-->
          <!--        :disabled="true"-->
          <!--        with-hover-->
          <!--        class="flex items-center gap-2"-->
          <!--        @click="emitEvent('openQuality', close)"-->
          <!--      >-->
          <!--        <div>{{ t('datasets.listView.viewLinks.openInDataQuality.short') }}</div>-->
          <!--      </PopoverContent>-->
          <template v-if="showDelete">
            <PopoverContentDivider class="hidden md:block" />
            <PopoverContent
              with-hover
              class="flex items-center justify-center gap-2 md:justify-start"
              @click="emitEvent('delete', close)"
            >
              <IconClose class="size-7 text-delete" />
              <div class="hidden md:block">{{ t('datasets.listView.viewLinks.delete.short') }}</div>
            </PopoverContent>
          </template>
        </div>
      </div>
    </PopoverCustomPanel>
  </ThreeDotsPopover>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
import OdhLoading from '@/components/svg/odh/OdhLoading.vue';

const { t } = useI18n();


withDefaults(
  defineProps<{
    id: RecordId;
    showDelete?: boolean;
    showEdit?: boolean;
    showDuplicate?: boolean;
    showForceSync?: boolean;
    showPush?: boolean;
  }>(),
  {
    showDelete: false,
    showEdit: false,
    showDuplicate: false,
    showForceSync: false,
    showPush: false
  }
);

const isOpen = ref(false);

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
  onClose(closePopup);
};

const onOpen = () => {
  isOpen.value = true;
};

const onClose = (closePopup?: () => void) => {
  isOpen.value = false;
  if (closePopup) closePopup();
};

</script>
