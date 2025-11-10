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
        mode = 'column';
      "
      @update:cols="applyChangesWithCheckpoint"
    />

    <ColumnSettings
      v-if="mode === 'column'"
      v-model:col="columns[editColIndex!]"
      @update:col="applyChangesWithCheckpoint"
      @back="mode = 'tableColumns'"
    />

    <div class="mt-4 flex flex-wrap gap-1 sm:gap-2">
      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="saveChanges"
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.save') }}
      </ButtonCustom>

      <ButtonCustom
        :disabled="!canUndoLastChange"
        :size="Size.sm"
        @click="undoLastChange"
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.undo') }}
      </ButtonCustom>
      <ButtonCustom
        :disabled="!canRedoLastChange"
        :size="Size.sm"
        @click="redoLastChange()"
      >
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
      <ButtonCustom
        :disabled="userPreferredDatasetSource != 'user'"
        :size="Size.sm"
        @click="
          deleteActiveConfiguration();
          mode = 'tableColumns';
        "
      >
        {{ t('datasets.listView.toolBox.columnConfiguration.deleteConfig') }}
      </ButtonCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NavigationGuard,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../../../components/button/types';
import { useMetaDataForAllDatasets } from '../../../../../../pages/datasets/overview/useDatasets';
import { CellComponent } from '../../../../../cellComponents/types';
import { findMetaDataForPathAndQuery } from '../../../../../metaDataConfig/tourism/useMetaData';
import { useUserSettings } from '../../../../../user/userSettings';
import { computeRoutePath } from '../../../../location/routePath';
import { stringifyRouteQuery } from '../../../../location/stringifyQuery';
import { injectColumnConfiguration } from './columnConfiguration';
import ColumnSettings from './ColumnSettings.vue';
import ColumnsList from './ColumnsList.vue';

const { t } = useI18n();

const mode = ref<'tableColumns' | 'column'>('tableColumns');

const editColIndex = ref<number | null>(null);

const {
  columns,
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
  mode.value = 'column';
  applyChangesWithCheckpoint();
};

const { metaData } = useMetaDataForAllDatasets();

const columnConfiguratorGuard: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded
) => {
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
  if (toMetaData?.id !== fromMetaData?.id) {
    mode.value = 'tableColumns';
  }
};

onBeforeRouteLeave(columnConfiguratorGuard);
onBeforeRouteUpdate(columnConfiguratorGuard);
</script>
