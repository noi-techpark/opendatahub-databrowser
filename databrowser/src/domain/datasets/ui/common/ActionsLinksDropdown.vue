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
        v-if="showEdit"
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('edit', close)"
      >
        <IconEdit class="text-green-500" />
        <div>{{ t('datasets.header.actions.edit') }}</div>
      </PopoverContent>
      <PopoverContentDivider v-if="showEdit" />
      <PopoverContent
        with-hover
        class="flex items-center gap-2"
        @click="emitEvent('refresh', close)"
      >
        <IconReload class="text-green-500" />
        <div>{{ t('datasets.header.actions.refresh') }}</div>
      </PopoverContent>
      <template v-if="showForceSync">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('sync', close)"
        >
          <OdhLoading class="text-green-500" />
          <div>{{ t('datasets.header.actions.forceSync') }}</div>
        </PopoverContent>
      </template>
      <template v-if="showPush">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('push', close)"
        >
          <IconPush class="text-green-500" />
          <div>{{ t('datasets.header.actions.push') }}</div>
        </PopoverContent>
      </template>
      <template v-if="showDuplicate">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('duplicate', close)"
        >
          <IconCopy class="text-green-500" />
          <div>{{ t('datasets.header.actions.duplicate') }}</div>
        </PopoverContent>
      </template>
      <template v-if="showDelete">
        <PopoverContentDivider />
        <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('delete', close)"
        >
          <IconClose class="size-7 text-delete" />
          <div>{{ t('datasets.header.actions.delete') }}</div>
        </PopoverContent>
      </template>
    </PopoverCustomPanel>
  </ThreeDotsPopover>
</template>

<script setup lang="ts">
import PopoverCustomPanel from '@/components/popover/PopoverCustomPanel.vue';
import PopoverContentDivider from '@/components/popover/PopoverContentDivider.vue';
import PopoverContent from '@/components/popover/PopoverContent.vue';
import ThreeDotsPopover from '@/components/popover/ThreeDotsPopover.vue';
import { useI18n } from 'vue-i18n';
import IconReload from '@/components/svg/IconReload.vue';
import IconEdit from '@/components/svg/IconEdit.vue';
import IconPush from '@/components/svg/IconPush.vue';
import IconCopy from '@/components/svg/IconCopy.vue';
import IconClose from '@/components/svg/IconClose.vue';
import OdhLoading from '@/components/svg/odh/OdhLoading.vue';
import OdhActions from '@/components/svg/odh/OdhActions.vue';
import DatasetHeaderLink from '@/domain/datasets/ui/header/DatasetHeaderLink.vue';

const { t } = useI18n();

withDefaults(
  defineProps<{
    showEdit?: boolean;
    showDelete?: boolean;
    showDuplicate?: boolean;
    showForceSync?: boolean;
    showPush?: boolean;
  }>(),
  {
    showEdit: false,
    showDelete: false,
    showDuplicate: false,
    showForceSync: false,
    showPush: false,
  }
);

const emit = defineEmits(['edit', 'refresh', 'sync', 'push', 'duplicate', 'delete']);

const emitEvent = (
    event: 'edit' | 'refresh' | 'sync' | 'push' | 'duplicate' | 'delete',
    closePopup: () => void
) => {
  emit(event);
  closePopup();
};

</script>
