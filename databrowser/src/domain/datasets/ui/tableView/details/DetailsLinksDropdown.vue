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

    <PopoverCustomPanel v-slot="{ close }" class="w-48">
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
          disabled
          class="flex items-center gap-2"
          @click="emitEvent('push', close)"
      >
        <IconPush />
        <div>Push</div>
      </PopoverContent>
      <PopoverContentDivider />
      <PopoverContent
          with-hover
          class="flex items-center gap-2"
          @click="emitEvent('delete', close)"
      >
        <IconDelete class="text-delete" />
        <div>Delete</div>
      </PopoverContent>
    </PopoverCustomPanel>
  </ThreeDotsPopover>
</template>

<script setup lang="ts">
import PopoverCustomPanel from '@/components/popover/PopoverCustomPanel.vue';
import PopoverContentDivider from '@/components/popover/PopoverContentDivider.vue';
import PopoverContent from '@/components/popover/PopoverContent.vue';
import IconCopy from '@/components/svg/IconCopy.vue';
import IconDelete from '@/components/svg/IconDelete.vue';
import IconPush from '@/components/svg/IconPush.vue';
import ThreeDotsPopover from '@/components/popover/ThreeDotsPopover.vue';
import IconThreeDots from "@/components/svg/IconThreeDots.vue";
import {useI18n} from "vue-i18n";
import ButtonCustom from "@/components/button/ButtonCustom.vue";

const { t } = useI18n();

const emit = defineEmits(['duplicate', 'push', 'delete']);

const emitEvent = (
    event: 'duplicate' | 'push' | 'delete',
    closePopup: () => void
) => {
  emit(event);
  closePopup();
};
</script>
