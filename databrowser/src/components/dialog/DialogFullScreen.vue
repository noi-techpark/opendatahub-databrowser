<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      class="relative"
      :style="`z-index:${zIndex}`"
      @close="emit('close')"
    >
      <DialogOverlay />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="h-full p-2">
          <DialogPanelTransitionChild>
            <DialogPanel
              class="flex h-full w-full flex-col overflow-auto rounded bg-white align-middle shadow-xl transition-all"
            >
              <slot></slot>
            </DialogPanel>
          </DialogPanelTransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue';

import DialogOverlay from './DialogOverlay.vue';
import DialogPanelTransitionChild from './DialogPanelTransitionChild.vue';

const emit = defineEmits<{ (e: 'close'): void }>();

withDefaults(defineProps<{ isOpen: boolean; zIndex?: number }>(), {
  zIndex: 1000,
});
</script>
