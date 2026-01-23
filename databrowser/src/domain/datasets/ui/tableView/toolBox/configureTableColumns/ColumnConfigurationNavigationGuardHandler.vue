<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ColumnConfigurationSaveGuardDialog
    v-if="leaveSectionDialogVisible"
    @cancel="leaveSectionDialogResult = 'cancel'"
    @discard-changes="leaveSectionDialogResult = 'discard'"
    @save-changes="leaveSectionDialogResult = 'save'"
  />
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { toRefs } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { registerUserSettingsGuard } from '../../../../../user/userSettingsGuard';
import { useColumnConfigurationNavigationGuard } from './columnConfigurationNavigationGuard';
import ColumnConfigurationSaveGuardDialog from './ColumnConfigurationNavigationGuardDialog.vue';

const emit = defineEmits(['discardChanges', 'saveChanges']);

const props = defineProps<{
  hasUnsavedChanges: boolean;
  isSaveSuccess: boolean;
}>();
const { hasUnsavedChanges, isSaveSuccess } = toRefs(props);

const {
  leaveSectionDialogResult,
  leaveSectionDialogVisible,
  preferredDatasetSourceGuard,
  routeGuard,
} = useColumnConfigurationNavigationGuard(
  isSaveSuccess,
  hasUnsavedChanges,
  emit
);

// Register guard for when "preferredDatasetSource" user setting changes
registerUserSettingsGuard(
  'preferredDatasetSource',
  preferredDatasetSourceGuard
);

// Register guard for route changes
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
