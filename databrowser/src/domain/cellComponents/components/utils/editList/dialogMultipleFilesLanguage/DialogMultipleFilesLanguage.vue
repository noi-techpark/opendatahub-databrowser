<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" class="relative z-50" @close="emit('close')">
        <DialogOverlay />
        <DialogOverlayContainer>
          <DialogPanel
            class="w-full max-w-2xl overflow-hidden rounded-sm bg-white text-left align-middle shadow-xl transition-all"
          >
            <div class="bg-gray-50 px-4 py-6">
              <DialogTitle
                as="h3"
                class="text-center text-xl leading-6 font-semibold text-dialog"
              >
                {{ t('datasets.editView.dialog.multipleFilesLanguage.title') }}
              </DialogTitle>
              <DialogDescription class="mt-4 text-center text-dialog">
                {{
                  t(
                    'datasets.editView.dialog.multipleFilesLanguage.description'
                  )
                }}
              </DialogDescription>
            </div>
            <div class="mt-4 flex flex-col gap-2 px-4 pb-4">
              <EditListDocumentLanguagesTab
                :items="dialogStore.items"
                class="max-h-128 overflow-y-auto"
              >
                <template #body="{ item }">
                  <EventDocumentInputDialogTable :items="item" />
                </template>
              </EditListDocumentLanguagesTab>
              <div class="flex flex-col gap-2">
                <ButtonCustom
                  :variant="Variant.solid"
                  class="grow"
                  @click="saveAndNext()"
                  >{{
                    t(
                      'datasets.editView.dialog.multipleFilesLanguage.buttonNext'
                    )
                  }}</ButtonCustom
                >
                <ButtonCustom
                  :variant="Variant.ghost"
                  class="grow"
                  @click="discardUpdates()"
                  >{{
                    t(
                      'datasets.editView.dialog.multipleFilesLanguage.buttonDiscardChanges'
                    )
                  }}</ButtonCustom
                >
              </div>
            </div>
          </DialogPanel>
        </DialogOverlayContainer>
      </Dialog>
    </TransitionRoot>
    <DialogConfirmDeselectAllLanguages
      :is-open="showConfirmDeselectAllLanguages"
      @delete-doc-and-names="deleteDocAndNames()"
      @keep-doc-delete-names="keepDocDeleteNames()"
      @close="closeConfirmDeselectAllLanguages()"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { ref, watch } from 'vue';

import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
} from '@headlessui/vue';

import DialogOverlay from '../../../../../../components/dialog/DialogOverlay.vue';
import DialogOverlayContainer from '../../../../../../components/dialog/DialogOverlayContainer.vue';
import EventDocumentInputDialogTable from './EventDocumentInputDialogTable.vue';
import EditListDocumentLanguagesTab from './EditListDocumentLanguagesTab.vue';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Variant } from '../../../../../../components/button/types';
import { useDialogStore } from './dialogStore';
import DialogConfirmDeselectAllLanguages from './DialogConfirmDeselectAllLanguages.vue';
import {
  addItemsInModalAndSave,
  updateItemsInModalAndSave,
  setIgnoreDelete,
  removeAllCurrentItemNames,
} from './utils';

const { t } = useI18n();
const emit = defineEmits(['save', 'close']);

const showConfirmDeselectAllLanguages = ref(false);

const dialogStore = useDialogStore();

const props = defineProps<{
  isOpen: boolean;
  isAdd?: boolean;
}>();

watch(
  () => dialogStore.items,
  (newVal) => {
    if (props.isAdd) {
      return;
    }

    const currentDocument = newVal[0];
    if (
      !currentDocument ||
      currentDocument.data.some((item) => item.available)
    ) {
      return;
    }

    openConfirmDeselectAllLanguages();
  }
);

const saveAndNext = () => {
  if (props.isAdd) {
    addItemsInModalAndSave();
  } else {
    updateItemsInModalAndSave();
  }

  emit('close');
};

const discardUpdates = () => {
  emit('close');
};

const deleteDocAndNames = () => {
  saveAndNext();
  closeConfirmDeselectAllLanguages();
};

const keepDocDeleteNames = () => {
  setIgnoreDelete(true);

  removeAllCurrentItemNames();
  saveAndNext();
  closeConfirmDeselectAllLanguages();

  setIgnoreDelete(false);
};

const openConfirmDeselectAllLanguages = () => {
  showConfirmDeselectAllLanguages.value = true;
};

const closeConfirmDeselectAllLanguages = () => {
  showConfirmDeselectAllLanguages.value = false;
};
</script>
