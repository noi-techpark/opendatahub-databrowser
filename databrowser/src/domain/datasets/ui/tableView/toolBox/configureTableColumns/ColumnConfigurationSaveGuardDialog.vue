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
import { until } from '@vueuse/shared';
import { ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NavigationGuard,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Variant } from '../../../../../../components/button/types';
import DialogCustom from '../../../../../../components/dialog/DialogCustom.vue';
import { useMetaDataForAllDatasets } from '../../../../../../pages/datasets/overview/useDatasets';
import { findMetaDataForPathAndQuery } from '../../../../../metaDataConfig/tourism/useMetaData';
import { useUserSettings } from '../../../../../user/userSettings';
import { computeRoutePath } from '../../../../location/routePath';
import { stringifyRouteQuery } from '../../../../location/stringifyQuery';

const { t } = useI18n();

const emit = defineEmits(['discardChanges', 'saveChanges']);

const props = defineProps<{
  hasUnsavedChanges: boolean;
  isSaveSuccess: boolean;
}>();
const { isSaveSuccess } = toRefs(props);

const leaveSectionDialogResult = ref<'save' | 'discard' | 'cancel'>();
const leaveSectionDialogVisible = ref(false);

useUserSettings().registerGuard(
  'preferredDatasetSource',
  async (next, previous) => {
    console.log('!!!!User settings guard triggered');
    // If there are no changes, just navigate
    if (!props.hasUnsavedChanges) {
      return true;
    }

    if (next.preferredDatasetSource === previous.preferredDatasetSource) {
      console.log('!!!!No change in dataset source, continue navigation');
      return true;
    }

    console.log('!!!!Dataset source is changing, show leave-section dialog');

    // Reset result variable and show dialog
    leaveSectionDialogResult.value = undefined;
    leaveSectionDialogVisible.value = true;

    // Wait until the dialog returns a result
    await until(leaveSectionDialogResult).not.toBeUndefined();

    // Hide dialog
    leaveSectionDialogVisible.value = false;

    // On cancel do nothing
    if (leaveSectionDialogResult.value === 'cancel') {
      return false;
    }

    // On discard just continue navigate
    if (leaveSectionDialogResult.value === 'discard') {
      emit('discardChanges');
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
  }
);

const { metaData } = useMetaDataForAllDatasets();

const leaveRouteCheck: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded
) => {
  // If there are no changes, just navigate
  if (!props.hasUnsavedChanges) {
    return true;
  }

  // Check if we leave current dataset
  const toMetaData = findMetaDataForPathAndQuery(
    metaData.value,
    computeRoutePath(to),
    stringifyRouteQuery(to.query)
  );
  const fromMetaData = findMetaDataForPathAndQuery(
    metaData.value,
    computeRoutePath(from),
    stringifyRouteQuery(from.query)
  );

  if (toMetaData?.id === fromMetaData?.id) {
    return true;
  }

  // Reset result variable and show dialog
  leaveSectionDialogResult.value = undefined;
  leaveSectionDialogVisible.value = true;

  // Wait until the dialog returns a result
  await until(leaveSectionDialogResult).not.toBeUndefined();

  // Hide dialog
  leaveSectionDialogVisible.value = false;

  // On cancel do nothing
  if (leaveSectionDialogResult.value === 'cancel') {
    return false;
  }

  // On discard just continue navigate
  if (leaveSectionDialogResult.value === 'discard') {
    emit('discardChanges');
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
};

onBeforeRouteLeave(leaveRouteCheck);
onBeforeRouteUpdate(leaveRouteCheck);
</script>
