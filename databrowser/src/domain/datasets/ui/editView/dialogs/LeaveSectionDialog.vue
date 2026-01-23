<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="dialogsStore.leaveSectionDialogVisible" :width="DialogPanelWidth.sm">
    <template #title>
      {{ t('datasets.editView.dialog.leaveSection.title') }}
    </template>
    <template #description>
      {{ t('datasets.editView.dialog.leaveSection.description') }}
    </template>
    <template #body>
      <ButtonCustom
        class="font-semibold"
        @click="leaveSectionDialogResult = 'save'"
      >
        {{ t('datasets.editView.dialog.leaveSection.buttonSave') }}
      </ButtonCustom>
      <ButtonCustom
        class="font-semibold"
        :variant="Variant.ghost"
        :tone="Tone.primary"
        @click="leaveSectionDialogResult = 'discard'"
      >
        {{ t('datasets.editView.dialog.leaveSection.buttonDontSave') }}
      </ButtonCustom>
      <ButtonCustom
        class="mt-2 font-semibold"
        :variant="Variant.ghost"
        :tone="Tone.primary"
        @click="leaveSectionDialogResult = 'cancel'"
      >
        {{ t('datasets.editView.dialog.leaveSection.buttonCancel') }}
      </ButtonCustom>
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { until } from '@vueuse/shared';
import { ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import { Tone, Variant } from '@/components/button/types';
import DialogCustom from '@/components/dialog/DialogCustom.vue';
import { useEditStore } from '../store/editStore';
import { useDialogsStore } from './dialogsStore';
import { DialogPanelWidth } from '@/components/dialog/types';

const { t } = useI18n();

const emit = defineEmits(['saveChanges']);

const props = defineProps<{ isSaveSuccess: boolean }>();
const { isSaveSuccess } = toRefs(props);

const editStore = useEditStore();

const dialogsStore = useDialogsStore();

const leaveSectionDialogResult = ref<'save' | 'discard' | 'cancel'>();

onBeforeRouteLeave(async () => {
  // If there are no changes, just navigate
  if (editStore.isEqual) {
    return true;
  }

  // Reset result variable and show dialog
  leaveSectionDialogResult.value = undefined;
  dialogsStore.leaveSectionDialogVisible = true;

  // Wait until the dialog returns a result
  await until(leaveSectionDialogResult).not.toBeUndefined();

  // Hide dialog
  dialogsStore.leaveSectionDialogVisible = false;

  // On cancel do nothing
  if (leaveSectionDialogResult.value === 'cancel') {
    return false;
  }

  // On discard just continue navigate
  if (leaveSectionDialogResult.value === 'discard') {
    return true;
  }

  // On save do data save and then continue navigation
  if (leaveSectionDialogResult.value === 'save') {
    emit('saveChanges');
    await until(isSaveSuccess).toBe(true);
    return true;
  }

  throw new Error(
    'Could not determine leave-section dialog result - this should not happen and is a bug. Please contact help@opendatahub.com'
  );
});
</script>
