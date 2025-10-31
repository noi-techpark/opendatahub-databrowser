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

type ColumnConfigurationReturnType = ReturnType<typeof useColumnConfiguration>;

export const useColumnConfiguration = () => {
  const datasetId = computed(() => useMetaDataStore().currentMetaData?.id);
  const datasetName = computed(
    () => useMetaDataStore().currentMetaData?.shortname
  );

  const initialColumns = ref<PropertyConfig[]>([]);
  const columns = ref<PropertyConfig[]>([]);

  const { clear, commit, undo, redo, canUndo, canRedo } = useManualRefHistory(
    columns,
    { clone: true }
  );

  const debouncedCommit = useDebounceFn(() => commit(), 500);

  // const isDeprecated = (col: PropertyConfig) => {
  //   return col.deprecationInfo?.length ?? 0 > 0;
  // };

  const { baseViews, source } = storeToRefs(useDatasetBaseInfoStore());

  watchDebounced(
    [datasetId, source],
    ([newId, newSource], [oldId, oldSource]) => {
      if (newId !== oldId) {
        console.log(
          `MetaData ID changed from "${oldId}" to "${newId}", resetting cols`
        );
        columns.value =
          baseViews.value?.table?.elements.map((col) => ({
            ...col,
            hidden: col.hidden ?? false,
          })) ?? [];
        initialColumns.value = R.clone(columns.value);
        commit();
        clear();
      } else {
        console.log('MetaData ID did not change, no reset needed');
      }

      if (newSource !== oldSource) {
        console.log(
          `Data source changed from "${oldSource}" to "${newSource}", resetting cols`
        );
        columns.value =
          baseViews.value?.table?.elements.map((col) => ({
            ...col,
            hidden: col.hidden ?? false,
          })) ?? [];
        initialColumns.value = R.clone(columns.value);
        commit();
        clear();
      } else {
        console.log('Data source did not change, no reset needed');
      }

      // if (!showDeprecated) {
      //   columns.value = columns.value.filter((col) => !isDeprecated(col));
      // }
    },
    { immediate: true, debounce: 300 }
  );

  const isColumnConfigChanged = computed(
    () => !R.equals(initialColumns.value, columns.value)
  );

  const isSaveSuccess = ref(false);

  const commitAndApplyChanges = () => {
    debouncedCommit();
    applyChanges();
  };

  const applyChanges = () => {
    baseViews.value = R.assocPath(
      ['table', 'elements'],
      columns.value,
      baseViews.value ?? {}
    );

    isSaveSuccess.value = false;
  };

  const { getUserSetting, updateUserSetting } = useUserSettings();
  const saveChanges = async () => {
    if (datasetId.value == null) {
      console.error('No datasetId available, cannot save column config');
      return;
    }

    await updateUserSetting('preferredDatasetSource', 'user', {
      skipGuards: true,
    });

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

    await updateUserSetting('views', { tableView }, { skipGuards: true });

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
    initialColumns,
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
