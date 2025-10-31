// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  useDebounceFn,
  useManualRefHistory,
  watchDebounced,
} from '@vueuse/core';
import { storeToRefs } from 'pinia';
import * as R from 'ramda';
import { computed, inject, InjectionKey, provide, ref } from 'vue';
import { useMetaDataStore } from '../../../../../metaDataConfig/tourism/metaDataStore';
import { useUserSettings } from '../../../../../user/userSettings';
import { useDatasetBaseInfoStore } from '../../../../config/store/datasetBaseInfoStore';
import { PropertyConfig } from '../../../../config/types';
import { useToolBoxStore } from '../../../toolBox/toolBoxStore';

type ColumnConfigurationReturnType = ReturnType<typeof useColumnConfiguration>;

export const useColumnConfiguration = () => {
  const initialColumns = ref<PropertyConfig[]>([]);
  const columns = ref<PropertyConfig[]>([]);

  const isColumnConfigChanged = computed(
    () => !R.equals(initialColumns.value, columns.value)
  );

  // Set up manual history tracking for columns to enable undo/redo functionality
  const { clear, commit, undo, redo, canUndo, canRedo } = useManualRefHistory(
    columns,
    { clone: true }
  );
  const debouncedCommit = useDebounceFn(() => commit(), 500);

  // Get dataset metadata for current dataset
  const datasetId = computed(() => useMetaDataStore().currentMetaData?.id);
  const datasetName = computed(
    () => useMetaDataStore().currentMetaData?.shortname
  );

  // Get source and base views from dataset store
  const { source, baseViews } = storeToRefs(useDatasetBaseInfoStore());

  // Watch for changes in datasetId, source, or deprecated setting to update columns
  watchDebounced(
    [datasetId, source, () => useToolBoxStore().settings.showDeprecated],
    () => {
      columns.value =
        baseViews.value?.table?.elements.map((column) => ({
          ...column,
          hidden: column.hidden ?? false,
        })) ?? [];

      // Filter out deprecated columns if the setting is disabled
      if (!useToolBoxStore().settings.showDeprecated) {
        columns.value = columns.value.filter((column) => {
          const deprecated = column.deprecationInfo?.length ?? 0 > 0;
          return !deprecated;
        });
      }

      initialColumns.value = R.clone(columns.value);
      commit();
      clear();
    },
    { immediate: true, debounce: 300 }
  );

  const isSaveSuccess = ref(false);

  const applyChanges = () => {
    baseViews.value = R.assocPath(
      ['table', 'elements'],
      columns.value,
      baseViews.value ?? {}
    );

    isSaveSuccess.value = false;
  };

  const commitAndApplyChanges = () => {
    debouncedCommit();
    applyChanges();
  };

  const { getUserSetting, updateUserSetting } = useUserSettings();
  const saveChanges = async () => {
    if (datasetId.value == null) {
      console.error('No datasetId available, cannot save column config');
      return;
    }

    // Set preferred dataset source to 'user' to indicate custom configuration.
    // Skip guards to allow saving in any case.
    await updateUserSetting('preferredDatasetSource', 'user', {
      skipGuards: true,
    });

    // Update the tableView user setting with the new column configuration
    const views = getUserSetting('views');
    const tableView = R.assocPath(
      ['cols', datasetId.value],
      [
        {
          id: datasetId.value,
          title: datasetName.value,
          elements: columns.value,
        },
      ],
      views.tableView ?? {}
    );

    // Save the updated tableView back to user settings, skipping guards
    await updateUserSetting('views', { tableView }, { skipGuards: true });

    // Clear undo / redo history after saving
    clear();

    initialColumns.value = columns.value;

    isSaveSuccess.value = true;
  };

  const discardChanges = () => {
    if (datasetId.value == null) {
      console.error('No datasetId available, cannot discard column config');
      return;
    }

    columns.value = R.clone(initialColumns.value);
    commit();
    clear();

    isSaveSuccess.value = true;
  };

  return {
    columns,
    isColumnConfigChanged,
    datasetId,
    datasetName,
    isSaveSuccess,
    commitAndApplyChanges,
    applyChanges,
    saveChanges,
    discardChanges,
    canUndoLastChange: canUndo,
    canRedoLastChange: canRedo,
    undoLastChange: undo,
    redoLastChange: redo,
  };
};

export const columnConfigurationInjectKey =
  Symbol() as InjectionKey<ColumnConfigurationReturnType>;

export const provideColumnConfiguration = (): Pick<
  ColumnConfigurationReturnType,
  'isColumnConfigChanged' | 'isSaveSuccess' | 'discardChanges' | 'saveChanges'
> => {
  const columnConfiguration = useColumnConfiguration();

  provide(columnConfigurationInjectKey, columnConfiguration);

  return columnConfiguration;
};

export const injectColumnConfiguration = (): ColumnConfigurationReturnType => {
  const columnConfiguration = inject(columnConfigurationInjectKey);

  if (!columnConfiguration) {
    throw new Error(
      'useColumnConfiguration must be used within a provider of columnConfigurationInjectKey'
    );
  }

  return columnConfiguration;
};
