<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <DialogOverlay />
      <DialogOverlayContainer>
        <DialogPanel
          class="w-full max-w-md overflow-hidden rounded-sm bg-white text-left align-middle shadow-xl transition-all"
        >
          <div class="bg-gray-50 px-4 py-6">
            <DialogTitle
              as="h3"
              class="text-center text-xl leading-6 font-semibold text-dialog"
            >
              {{
                t('datasets.editView.dialog.confirmDeselectAllLanguages.title')
              }}
            </DialogTitle>
            <DialogDescription class="mt-4 text-center text-dialog">
              {{
                t(
                  'datasets.editView.dialog.confirmDeselectAllLanguages.description'
                )
              }}
            </DialogDescription>
          </div>
          <div class="mt-4 flex flex-col gap-2 px-4 pb-4">
            <ButtonCustom
              :variant="Variant.solid"
              class="grow"
              @click="deleteDocumentAndNames()"
              >{{
                t(
                  'datasets.editView.dialog.confirmDeselectAllLanguages.buttonDeleteDocAndNames'
                )
              }}</ButtonCustom
            >
            <ButtonCustom
              :variant="Variant.ghost"
              class="grow"
              @click="keepDocDeleteNames()"
              >{{
                t(
                  'datasets.editView.dialog.confirmDeselectAllLanguages.buttonKeepDocDeleteNames'
                )
              }}</ButtonCustom
            >
            <ButtonCustom
              :variant="Variant.ghost"
              class="grow"
              @click="cancel()"
              >{{
                t(
                  'datasets.editView.dialog.confirmDeselectAllLanguages.buttonCancel'
                )
              }}</ButtonCustom
            >
          </div>
        </DialogPanel>
      </DialogOverlayContainer>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from '@headlessui/vue';

import DialogOverlay from '../../../../../../components/dialog/DialogOverlay.vue';
import DialogOverlayContainer from '../../../../../../components/dialog/DialogOverlayContainer.vue';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Variant } from '../../../../../../components/button/types';

const { t } = useI18n();
const emit = defineEmits(['deleteDocAndNames', 'keepDocDeleteNames', 'close']);

defineProps<{
  isOpen: boolean;
}>();

const deleteDocumentAndNames = () => {
  emit('deleteDocAndNames');
};

const keepDocDeleteNames = () => {
  emit('keepDocDeleteNames');
};

const cancel = () => {
  emit('close');
};
</script>
