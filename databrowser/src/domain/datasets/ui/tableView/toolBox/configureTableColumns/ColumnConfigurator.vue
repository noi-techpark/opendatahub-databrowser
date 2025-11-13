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
        @click="saveChanges"
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
        @click="redoLastChange()"
      >
        <IconEditorRedo class="size-4" />
        {{ t('datasets.listView.toolBox.columnConfiguration.redo') }}
      </ButtonCustom>
      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="
          discardChanges();
          mode = 'tableColumns';
        "
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.reset') }}
      </ButtonCustom>
    </div>
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

    <ColumnConfigurationDeleteDialog
      v-if="showDeleteConfirmationDialog"
      :config-title="activeConfigName"
      @deleteConfirmed="
        deleteActiveConfiguration();
        showDeleteConfirmationDialog = false;
        mode = 'tableColumns';
      "
      @deleteCancelled="showDeleteConfirmationDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
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
import { useColumnConfigurationImportExport } from './columnConfigurationImportExport';
import ColumnSettings from './ColumnSettings.vue';
import ColumnsList from './ColumnsList.vue';

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

const userPreferredDatasetSource = useUserSettings().getUserSettingRef(
  'preferredDatasetSource'
);

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

const showDeleteConfirmationDialog = ref(false);

// Handle import/export of column configuration
const { exportConfiguration, importConfiguration } =
  useColumnConfigurationImportExport(columns, applyChangesWithCheckpoint);

// Add route guards to reset component mode on navigation if the dataset changes
// This prevents being stuck in column settings mode for a different dataset
const { datasetChangeGuard } = useColumnConfigurationDatasetChangeGuard(mode);
onBeforeRouteLeave(datasetChangeGuard);
onBeforeRouteUpdate(datasetChangeGuard);
</script>
