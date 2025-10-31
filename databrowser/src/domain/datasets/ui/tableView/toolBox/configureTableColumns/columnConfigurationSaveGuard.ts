// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { until } from '@vueuse/core';
import { ref, Ref } from 'vue';
import {
  NavigationGuard,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import { useMetaDataForAllDatasets } from '../../../../../../pages/datasets/overview/useDatasets';
import { DatasetPage } from '../../../../../../routes';
import { findMetaDataForPathAndQuery } from '../../../../../metaDataConfig/tourism/useMetaData';
import { UserSettingsGuard } from '../../../../../user/types';
import { computeRoutePath } from '../../../../location/routePath';
import { stringifyRouteQuery } from '../../../../location/stringifyQuery';

export const useColumnConfigurationSaveGuard = (
  isSaveSuccess: Ref<boolean>,
  hasUnsavedChanges: Ref<boolean>,
  emit: (event: 'saveChanges' | 'discardChanges') => void
) => {
  const leaveSectionDialogResult = ref<'save' | 'discard' | 'cancel'>();
  const leaveSectionDialogVisible = ref(false);

  // Handle the dialog logic
  const handleDialog = async () => {
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

  // Guard for user settings change
  const preferredDatasetSourceGuard: UserSettingsGuard = async (
    next,
    previous
  ) => {
    // If there are no changes, just navigate
    if (!hasUnsavedChanges.value) {
      return true;
    }

    // If the preferred dataset source is not changing, just navigate
    if (next.preferredDatasetSource === previous.preferredDatasetSource) {
      return true;
    }

    return handleDialog();
  };

  const { metaData } = useMetaDataForAllDatasets();

  // Guard for route changes
  const routeGuard: NavigationGuard = async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded
  ) => {
    // If there are no changes, just navigate
    if (!hasUnsavedChanges.value) {
      return true;
    }

    // Check if we are navigating to the table view of a dataset
    const isToTableView = to.name === DatasetPage.TABLE;

    // Find metadata for from and to route
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

    // If we stay in the same dataset's table view, just navigate
    if (isToTableView && toMetaData?.id === fromMetaData?.id) {
      return true;
    }

    return handleDialog();
  };

  return {
    leaveSectionDialogResult,
    leaveSectionDialogVisible,
    preferredDatasetSourceGuard,
    routeGuard,
  };
};
