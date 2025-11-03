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
import { randomId } from '../../../../../../components/utils/random';
import { useMetaDataStore } from '../../../../../metaDataConfig/tourism/metaDataStore';
import {
  UserSettings,
  UserSettingTableViewConfig,
} from '../../../../../user/types';
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

  const applyChangesWithoutCheckpoint = () => {
    baseViews.value = R.assocPath(
      ['table', 'elements'],
      columns.value,
      baseViews.value ?? {}
    );

    isSaveSuccess.value = false;
  };

  const applyChangesWithCheckpoint = () => {
    debouncedCommit();
    applyChangesWithoutCheckpoint();
  };

  const { getUserSetting, updateUserSetting } = useUserSettings();

  /**
   * Saves the current column configuration for the active dataset to user settings.
   *
   * This function performs the following operations:
   * 1. Validates that a datasetId is available
   * 2. Sets the preferred dataset source to 'user' to indicate custom configuration
   * 3. Updates or creates a column configuration for the current dataset
   * 4. Saves the configuration to the user's tableView settings
   * 5. Clears the undo/redo history and updates the initial columns state
   *
   * The function handles both cases:
   * - Updating an existing configuration if one exists for the active config ID
   * - Creating a new configuration with a generated ID if none exists
   *
   * @remarks
   * - All user setting updates are performed with `skipGuards: true` to bypass validation
   * - The save operation sets `isSaveSuccess.value` to true upon completion
   * - If no datasetId is available, the function logs an error and returns early
   *
   * @returns A promise that resolves when the configuration has been saved
   */
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

    // Check if there's an existing configuration for the current dataset
    const activeConfigId =
      views.tableView[datasetId.value]?.activeConfigId ?? randomId();

    // Find existing configuration by activeConfigId
    const config = views.tableView[datasetId.value]?.configs.find(
      (cfg) => cfg.id === activeConfigId
    );

    // If config exists, update it; otherwise, create a new one
    if (config != null) {
      // Update existing configuration
      const updatedConfig = {
        ...config,
        elements: columns.value,
      };

      const tableView = R.assocPath<
        UserSettingTableViewConfig,
        UserSettings['views']['tableView']
      >(
        [datasetId.value],
        {
          activeConfigId,
          configs:
            views.tableView[datasetId.value]?.configs.map((cfg) =>
              cfg.id === activeConfigId ? updatedConfig : cfg
            ) ?? [],
        },
        views.tableView ?? {}
      );

      // Save the updated tableView back to user settings, skipping guards
      await updateUserSetting('views', { tableView }, { skipGuards: true });
    } else {
      // Create a new configuration
      const newConfig = {
        id: activeConfigId,
        name: `${datasetName.value} (custom)`,
        elements: columns.value,
      };

      const tableView = R.assocPath<
        UserSettingTableViewConfig,
        UserSettings['views']['tableView']
      >(
        [datasetId.value],
        {
          activeConfigId,
          configs: [
            ...(views.tableView[datasetId.value]?.configs ?? []),
            newConfig,
          ],
        },
        views.tableView ?? {}
      );

      // Save the updated tableView back to user settings, skipping guards
      await updateUserSetting('views', { tableView }, { skipGuards: true });
    }

    // Clear undo / redo history after saving
    clear();

    initialColumns.value = columns.value;

    isSaveSuccess.value = true;
  };

  /**
   * Discards any changes made to the table column configuration and reverts to the initial state.
   *
   * This function performs the following actions:
   * - Validates that a datasetId is available
   * - Restores columns to their initial configuration
   * - Updates the baseViews with the initial column elements
   * - Commits the changes
   * - Clears any temporary state
   * - Sets the save success flag to true
   *
   * @remarks
   * If no datasetId is available, the function logs an error and returns early without making changes.
   *
   * @returns {void}
   */
  const discardChanges = () => {
    if (datasetId.value == null) {
      console.error('No datasetId available, cannot discard column config');
      return;
    }

    columns.value = R.clone(initialColumns.value);

    // Reset baseViews to initial columns
    baseViews.value = R.assocPath(
      ['table', 'elements'],
      columns.value,
      baseViews.value ?? {}
    );

    commit();
    clear();

    isSaveSuccess.value = true;
  };

  /**
   * Deletes the currently active column configuration for the dataset.
   *
   * This function removes the active configuration from the user's table view settings.
   * If no configurations remain after deletion, it cleans up the dataset entry entirely
   * and resets the preferred dataset source to 'embedded'.
   *
   * @remarks
   * - Requires a valid `datasetId` to be present
   * - Automatically selects the first remaining configuration as active after deletion
   * - Skips user setting guards when updating settings
   * - Resets `preferredDatasetSource` to 'embedded' when no configurations remain
   *
   * @returns {void}
   */
  const deleteActiveConfiguration = async () => {
    if (datasetId.value == null) {
      console.error(
        'No datasetId available, cannot delete column configuration'
      );
      return;
    }

    // Remove the tableView configuration for the current dataset from user settings
    const views = getUserSetting('views');

    // Check if there's an existing configuration for the current dataset
    const activeConfigId: string | undefined =
      views.tableView[datasetId.value]?.activeConfigId;

    if (activeConfigId == null) {
      console.warn('No active configuration to delete for this dataset');
      // Reset preferred dataset source to 'embedded', because no user configs remain
      await updateUserSetting('preferredDatasetSource', 'embedded', {
        skipGuards: true,
      });
      return;
    }

    // Find existing configuration by activeConfigId
    const config = views.tableView[datasetId.value]?.configs.find(
      (cfg) => cfg.id === activeConfigId
    );

    // If no config found, nothing to delete
    if (config == null) {
      console.warn('No configuration found to delete for this dataset');
      // Reset preferred dataset source to 'embedded', because no user configs remain
      await updateUserSetting('preferredDatasetSource', 'embedded', {
        skipGuards: true,
      });
      return;
    }

    // Filter out the active configuration to delete it
    const updatedConfigs =
      views.tableView[datasetId.value]?.configs.filter(
        (cfg) => cfg.id !== activeConfigId
      ) ?? [];

    // Determine new activeConfigId after deletion
    const newActiveConfigId =
      updatedConfigs.length > 0 ? updatedConfigs[0].id : undefined;

    if (newActiveConfigId == null) {
      // If no configurations remain, remove the entire entry for this dataset
      const tableView = R.dissocPath<UserSettings['views']['tableView']>(
        [datasetId.value],
        views.tableView ?? {}
      );

      // Save the updated tableView back to user settings, skipping guards
      await updateUserSetting('views', { tableView }, { skipGuards: true });
      // Also reset preferred dataset source to 'embedded', because no user configs remain
      await updateUserSetting('preferredDatasetSource', 'embedded', {
        skipGuards: true,
      });
    } else {
      // Otherwise, update the entry with remaining configurations
      const tableView = R.assocPath<
        UserSettingTableViewConfig,
        UserSettings['views']['tableView']
      >(
        [datasetId.value],
        {
          activeConfigId: newActiveConfigId,
          configs: updatedConfigs,
        },
        views.tableView ?? {}
      );

      // Save the updated tableView back to user settings, skipping guards
      await updateUserSetting('views', { tableView }, { skipGuards: true });
    }
  };

  const undoLastChange = () => {
    undo();
    applyChangesWithoutCheckpoint();
  };

  const redoLastChange = () => {
    redo();
    applyChangesWithoutCheckpoint();
  };

  return {
    columns,
    isColumnConfigChanged,
    datasetId,
    datasetName,
    isSaveSuccess,
    applyChangesWithCheckpoint,
    saveChanges,
    discardChanges,
    deleteActiveConfiguration,
    canUndoLastChange: canUndo,
    canRedoLastChange: canRedo,
    undoLastChange,
    redoLastChange,
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
