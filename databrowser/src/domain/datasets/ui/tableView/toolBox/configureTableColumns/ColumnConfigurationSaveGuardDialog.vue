<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogCustom :is-open="leaveSectionDialogVisible">
    <template #title>
      {{ t('datasets.editView.dialog.leaveSection.title') }}
    </template>
    <template #description>
      {{ t('datasets.editView.dialog.leaveSection.description') }}
    </template>
    <template #body>
      <ButtonCustom @click="leaveSectionDialogResult = 'save'">
        {{ t('datasets.editView.dialog.leaveSection.buttonSave') }}
      </ButtonCustom>
      <ButtonCustom
        :variant="Variant.ghost"
        @click="leaveSectionDialogResult = 'discard'"
      >
        {{ t('datasets.editView.dialog.leaveSection.buttonDontSave') }}
      </ButtonCustom>
      <ButtonCustom
        class="mt-2"
        :variant="Variant.ghost"
        @click="leaveSectionDialogResult = 'cancel'"
      >
        {{ t('datasets.editView.dialog.leaveSection.buttonCancel') }}
      </ButtonCustom>
    </template>
  </DialogCustom>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Variant } from '../../../../../../components/button/types';
import DialogCustom from '../../../../../../components/dialog/DialogCustom.vue';
import { useUserSettings } from '../../../../../user/userSettings';
import { useColumnConfigurationSaveGuard } from './columnConfigurationSaveGuard';

const { t } = useI18n();

const emit = defineEmits(['discardChanges', 'saveChanges']);

const props = defineProps<{
  hasUnsavedChanges: boolean;
  isSaveSuccess: boolean;
}>();
const { hasUnsavedChanges, isSaveSuccess } = toRefs(props);

const {
  leaveSectionDialogResult,
  leaveSectionDialogVisible,
  userSettingsGuard,
  routeGuard,
} = useColumnConfigurationSaveGuard(isSaveSuccess, hasUnsavedChanges, emit);

// Register guard for user settings change
useUserSettings().registerGuard('preferredDatasetSource', userSettingsGuard);

// Register route guards
onBeforeRouteLeave(routeGuard);
onBeforeRouteUpdate(routeGuard);

// Listen for window close / reload event and let the user know
// if there are unsaved changes
useEventListener(window, 'beforeunload', (evt) => {
  if (hasUnsavedChanges.value) {
    evt.returnValue = 'Do you really want to close?';
    return evt.returnValue;
  }
});
</script>
