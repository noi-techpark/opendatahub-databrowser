<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex h-full flex-col">
    <ColumnsList
      v-if="mode === 'tableColumns'"
      v-model:columns="columns"
      @add:column="addColumn"
      @edit:column="
        editColIndex = $event;
        mode = 'columnSettings';
      "
      @update:cols="applyChangesWithCheckpoint"
    />

    <ColumnSettings
      v-if="mode === 'columnSettings'"
      v-model:col="columns[editColIndex!]"
      :colIndex="editColIndex! + 1"
      @update:col="applyChangesWithCheckpoint"
      @back="mode = 'tableColumns'"
    />

    <div class="mt-4 flex flex-wrap gap-1 sm:gap-2">
      <ButtonCustom
        class="flex items-center gap-2"
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="beginSaveColumnConfiguration"
      >
        <IconCheckCircle class="size-4" />
        {{ t('datasets.listView.toolBox.columnConfiguration.save') }}
      </ButtonCustom>
      <ButtonCustom
        class="flex items-center gap-2"
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="undoLastChange"
      >
        <IconEditorUndo class="size-4" />
        {{ t('datasets.listView.toolBox.columnConfiguration.undo') }}
      </ButtonCustom>
      <ButtonCustom
        class="flex items-center gap-2"
        :disabled="!canRedoLastChange"
        :size="Size.sm"
        @click="redoLastChange"
      >
        <IconEditorRedo class="size-4" />
        {{ t('datasets.listView.toolBox.columnConfiguration.redo') }}
      </ButtonCustom>
      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="showDiscardConfirmationDialog = true"
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.reset') }}
      </ButtonCustom>
    </div>

    <ColumnConfigurationInvalidConfig
      v-if="configIssueType != null"
      :type="configIssueType"
      :errors="configIssues"
      class="mt-4"
      @close="setConfigIssues([], [])"
    />

    <div class="mt-4 flex flex-wrap gap-1 sm:gap-2">
      <ButtonCustom
        class="flex items-center gap-2"
        :disabled="userPreferredDatasetSource != 'user'"
        :size="Size.sm"
        @click="showDeleteConfirmationDialog = true"
      >
        <IconDelete class="size-4" />
        {{ t('datasets.listView.toolBox.columnConfiguration.deleteConfig') }}
      </ButtonCustom>

      <ButtonCustom
        class="flex items-center gap-2"
        :size="Size.sm"
        @click="
          exportConfiguration();
          mode = 'tableColumns';
        "
      >
        <IconDownload class="size-5" />
        {{ t('datasets.listView.toolBox.columnConfiguration.exportConfig') }}
      </ButtonCustom>
      <ButtonCustom
        class="flex items-center gap-2"
        :size="Size.sm"
        @click="
          importConfiguration();
          mode = 'tableColumns';
        "
      >
        <IconImport class="size-5" />
        {{ t('datasets.listView.toolBox.columnConfiguration.importConfig') }}
      </ButtonCustom>
    </div>

    <ColumnConfigurationSaveDialog
      v-if="showSaveConfirmationDialog"
      :config-title="activeConfigName"
      @save-confirmed="
        updateUserSetting('showSaveColumnConfigurationDialog', false);
        commitSaveColumnConfiguration();
        showSaveConfirmationDialog = false;
      "
      @save-cancelled="showSaveConfirmationDialog = false"
    />

    <ColumnConfigurationDiscardDialog
      v-if="showDiscardConfirmationDialog"
      :config-title="activeConfigName"
      @discard-confirmed="
        discardChanges();
        showDiscardConfirmationDialog = false;
        mode = 'tableColumns';
      "
      @discard-cancelled="showDiscardConfirmationDialog = false"
    />

    <ColumnConfigurationDeleteDialog
      v-if="showDeleteConfirmationDialog"
      :config-title="activeConfigName"
      @delete-confirmed="
        deleteActiveConfiguration();
        showDeleteConfirmationDialog = false;
        mode = 'tableColumns';
      "
      @delete-cancelled="showDeleteConfirmationDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../../components/button/types';
import IconEditorRedo from '../../../../../../components/html/icons/IconEditorRedo.vue';
import IconEditorUndo from '../../../../../../components/html/icons/IconEditorUndo.vue';
import IconCheckCircle from '../../../../../../components/svg/IconCheckCircle.vue';
import IconDelete from '../../../../../../components/svg/IconDelete.vue';
import IconDownload from '../../../../../../components/svg/IconDownload.vue';
import IconImport from '../../../../../../components/svg/IconImport.vue';
import { CellComponent } from '../../../../../cellComponents/types';
import { useUserSettings } from '../../../../../user/userSettings';
import { injectColumnConfiguration } from './columnConfiguration';
import { useColumnConfigurationDatasetChangeGuard } from './columnConfigurationDatasetChangeGuard';
import ColumnConfigurationDeleteDialog from './ColumnConfigurationDeleteDialog.vue';
import ColumnConfigurationDiscardDialog from './ColumnConfigurationDiscardDialog.vue';
import { useColumnConfigurationImportExport } from './columnConfigurationImportExport';
import ColumnConfigurationInvalidConfig from './ColumnConfigurationInvalidConfig.vue';
import ColumnConfigurationSaveDialog from './ColumnConfigurationSaveDialog.vue';
import ColumnSettings from './ColumnSettings.vue';
import ColumnsList from './ColumnsList.vue';
import {
  useColumnConfigurationValidation,
  validateColumnConfiguration,
} from './columnValidation';

const { t } = useI18n();

const mode = ref<'tableColumns' | 'columnSettings'>('tableColumns');

const editColIndex = ref<number | null>(null);

const {
  columns,
  activeConfigName,
  applyChangesWithCheckpoint,
  discardChanges,
  saveChanges,
  deleteActiveConfiguration,
  canUndoLastChange,
  canRedoLastChange,
  undoLastChange,
  redoLastChange,
} = injectColumnConfiguration();

// Access user settings
const { getUserSettingRef, updateUserSetting } = useUserSettings();
const userPreferredDatasetSource = getUserSettingRef('preferredDatasetSource');
const userShowSaveColumnConfigurationDialog = getUserSettingRef(
  'showSaveColumnConfigurationDialog'
);

const beginSaveColumnConfiguration = () => {
  if (userShowSaveColumnConfigurationDialog.value) {
    showSaveConfirmationDialog.value = true;
  } else {
    commitSaveColumnConfiguration();
  }
};

const commitSaveColumnConfiguration = () => {
  saveChanges();
  validateColumnConfigurationAndSetIssues();
};

const showSaveConfirmationDialog = ref(false);
const showDiscardConfirmationDialog = ref(false);
const showDeleteConfirmationDialog = ref(false);

const addColumn = () => {
  // Add a new column at the beginning of the list and switch to edit mode
  columns.value = [
    {
      title: t(
        'datasets.listView.toolBox.columnConfiguration.columnDefaultName'
      ),
      component: CellComponent.TypeBasedCell,
      objectMapping: {
        data: 'Id',
      },
      style: { widthInPx: 250 },
    },
    ...columns.value,
  ];
  editColIndex.value = 0;
  mode.value = 'columnSettings';
  applyChangesWithCheckpoint();
};

const { configIssues, configIssueType, setConfigIssues } =
  useColumnConfigurationValidation();

const validateColumnConfigurationAndSetIssues = () => {
  const { violations } = validateColumnConfiguration(columns.value);
  setConfigIssues([], violations);
};

watchDebounced(columns, () => validateColumnConfigurationAndSetIssues(), {
  deep: true,
  debounce: 300,
});

// Handle import/export of column configuration
const { exportConfiguration, importConfiguration } =
  useColumnConfigurationImportExport(
    columns,
    applyChangesWithCheckpoint,
    setConfigIssues
  );

// Add route guards to reset component mode on navigation if the dataset changes
// This prevents being stuck in column settings mode for a different dataset
const { datasetChangeGuard } = useColumnConfigurationDatasetChangeGuard(mode);
onBeforeRouteLeave(datasetChangeGuard);
onBeforeRouteUpdate(datasetChangeGuard);
</script>
