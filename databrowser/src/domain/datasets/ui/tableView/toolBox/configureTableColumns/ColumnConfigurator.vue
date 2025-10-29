<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <ColumnsList
      v-if="mode === 'tableColumns'"
      v-model:cols="columns"
      @edit:col="
        editColIndex = $event;
        mode = 'column';
      "
      @update:cols="commitAndApplyChanges"
    />

    <ColumnSettings
      v-if="mode === 'column'"
      v-model:col="columns[editColIndex!]"
      @update:col="commitAndApplyChanges"
      @back="mode = 'tableColumns'"
    />

    <div class="flex flex-wrap gap-1 sm:gap-2">
      <ButtonCustom
        :disabled="!isColumnConfigChanged"
        :size="Size.sm"
        @click="saveChanges"
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.save') }}
      </ButtonCustom>

      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="
          undoLastChange();
          applyChanges();
        "
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.undo') }}
      </ButtonCustom>
      <ButtonCustom
        :disabled="!canRedoLastChange"
        :size="Size.sm"
        @click="
          redoLastChange();
          applyChanges();
        "
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.redo') }}
      </ButtonCustom>
      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="discardChanges"
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.reset') }}
      </ButtonCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../../components/button/types';
import { injectColumnConfiguration } from './columnConfiguration';
import ColumnSettings from './ColumnSettings.vue';
import ColumnsList from './ColumnsList.vue';

const { t } = useI18n();

const mode = ref<'tableColumns' | 'column'>('tableColumns');

const editColIndex = ref<number | null>(null);

// const isDeprecated = (col: PropertyConfig) => {
//   return col.deprecationInfo?.length ?? 0 > 0;
// };

// const { baseViews, datasetPath, datasetQuery } = storeToRefs(
//   useDatasetBaseInfoStore()
// );

const {
  columns,
  isColumnConfigChanged,
  commitAndApplyChanges,
  applyChanges,
  discardChanges,
  saveChanges,
  canUndoLastChange,
  canRedoLastChange,
  undoLastChange,
  redoLastChange,
} = injectColumnConfiguration();

// const toolBoxStore = useToolBoxStore();

// const initialCols = ref<PropertyConfig[]>([]);
// const colsInternal = ref<PropertyConfig[]>([]);

// const {
//   initialColumns,
//   columns,
//   isColumnConfigChanged,
//   isSaveSuccess,
//   discardChanges,
//   saveChanges,
// } = useColumnConfiguration();

// const {
//   setIsColumnConfigChanged,
//   setIsSaveSuccess,
//   setDiscardChangesFn,
//   setSaveChangesFn,
// } = inject(columnConfigurationSaveGuardInjectKey)!;

// setDiscardChangesFn(discardChanges);
// setSaveChangesFn(saveChanges);
// watch(isColumnConfigChanged, (newVal) => setIsColumnConfigChanged(newVal));
// watch(isSaveSuccess, (newVal) => setIsSaveSuccess(newVal));

// onUnmounted(() => {
//   setDiscardChangesFn(undefined);
//   setSaveChangesFn(undefined);
// });

// const { history, clear, commit, undo, redo, canUndo, canRedo } =
//   useManualRefHistory(columns, { clone: true });

// const debouncedCommit = useDebounceFn(() => commit(), 500);

// let isFirstRunForPath = true;

// const { currentRoute } = useRouter();
// watch(currentRoute, (to, from) => {
//   isFirstRunForPath = isMajorConfigChange(to, from) === false;
//   console.log(
//     `ROUTE CHANGE DETECTED, isFirstRun: ${isFirstRunForPath}`,
//     to.fullPath,
//     from.fullPath
//   );
// });

// Initialize colsInternal and initialCols with debounce to avoid multiple rapid updates
// Note: initialCols will be set only on the first update, for subsequent updates only colsInternal
// is updated
// watchDebounced(
//   [
//     () => baseViews.value?.table?.elements,
//     () => toolBoxStore.settings.showDeprecated,
//   ],

//   ([elements, showDeprecated]) => {
//     // console.log('ROUTE OR SETTINGS CHANGED', R.clone(elements), showDeprecated);
//     // colsInternal.value =
//     //   elements?.map((col) => ({ ...col, hidden: col.hidden ?? false })) ?? [];
//     // if (!showDeprecated) {
//     //   colsInternal.value = colsInternal.value.filter(
//     //     (col) => !isDeprecated(col)
//     //   );
//     // }
//     // // console.log(`ROUTE OR SETTINGS CHANGED: "${oldPath}" GOT "${path}"`);
//     // // On first run, set initial cols
//     // if (isFirstRunForPath) {
//     //   console.log('is first run for path, setting initialCols');
//     //   initialCols.value = R.clone(colsInternal.value);
//     //   isFirstRunForPath = false;
//     //   commit();
//     //   clear();
//     // }
//   },
//   { debounce: 300 }
// );

// const { currentMetaData } = useMetaDataForRoute(datasetPath, datasetQuery);
// watch(
//   [currentMetaData, currentRoute],
//   ([newMeta, newRoute], [oldMeta, oldRoute]) => {
//     if (newMeta?.id !== oldMeta?.id) {
//       console.log(
//         `MetaData ID changed from "${oldMeta?.id}" to "${newMeta?.id}", resetting cols`
//       );
//       columns.value =
//         baseViews.value?.table?.elements.map((col) => ({
//           ...col,
//           hidden: col.hidden ?? false,
//         })) ?? [];
//       initialColumns.value = R.clone(columns.value);
//       commit();
//       clear();

//       // if (!showDeprecated) {
//       //   colsInternal.value = colsInternal.value.filter(
//       //     (col) => !isDeprecated(col)
//       //   );
//       // }
//     } else {
//       console.log('MetaData ID did not change, no reset needed');
//     }
//   },
//   { immediate: true }
// );

// const isColsUnmodified = computed(() => {
//   return (
//     JSON.stringify(initialCols.value) === JSON.stringify(colsInternal.value)
//   );
// });

// const isConfigModified = ref(false);
// watch

// const commitAndApply = () => {
//   debouncedCommit();
//   applyChanges();
// };

// const applyChanges = () => {
//   console.log(history.value);
//   baseViews.value = R.assocPath(
//     ['table', 'elements'],
//     columns.value,
//     baseViews.value ?? {}
//   );

//   isSaveSuccess.value = false;
// };

// const isSaveSuccess = ref(true);
// const { getUserSetting, updateUserSetting } = useUserSettings();
// const saveChanges = () => {
//   if (currentMetaData.value == null) {
//     console.error('No currentMetaData available, cannot save column config');
//     return;
//   }

//   updateUserSetting('preferredDatasetSource', 'user');

//   const views = getUserSetting('views');
//   const tableView = R.assocPath(
//     ['cols', currentMetaData.value.id],
//     [
//       {
//         id: currentMetaData.value.id,
//         title: currentMetaData.value.shortname,
//         elements: columns.value,
//       },
//     ],
//     views.tableView ?? {}
//   );
//   updateUserSetting('views', { tableView });

//   clear();

//   initialColumns.value = R.clone(columns.value);

//   isSaveSuccess.value = true;
// };

// const discardChanges = () => {
//   if (currentMetaData.value == null) {
//     console.error('No currentMetaData available, cannot discard column config');
//     return;
//   }

//   columns.value = R.clone(initialColumns.value);
//   commit();
//   clear();

//   isSaveSuccess.value = true;
// };
</script>
