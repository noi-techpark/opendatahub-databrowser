<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-20" @close="emit('close')">
      <DialogOverlay />
      <DialogOverlayContainer>
        <DialogPanel
          class="w-full overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all"
          :class="widthClass"
        >
          <DialogTitle
            as="h3"
            class="text-center text-xl font-bold leading-6 text-black"
          >
            <slot name="title"></slot>
          </DialogTitle>
          <DialogDescription class="mt-4 text-center text-dialog">
            <slot name="description"></slot>
          </DialogDescription>
          <div class="mt-6 flex flex-col gap-2">
            <slot name="body"></slot>
          </div>
        </DialogPanel>
      </DialogOverlayContainer>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from '@headlessui/vue';

import DialogOverlay from './DialogOverlay.vue';
import DialogOverlayContainer from './DialogOverlayContainer.vue';
import { DialogPanelWidth } from '@/components/dialog/types.ts';
import { computed } from 'vue';

const emit = defineEmits(['close']);

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    width?: DialogPanelWidth;
  }>(),
  {
    width: DialogPanelWidth.md,
  }
);

const widthClass = computed(() => {
  return 'max-w-' + props.width;
})
</script>
