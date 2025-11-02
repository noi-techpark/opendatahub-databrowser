<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <ColumnsList
      v-if="mode === 'tableColumns'"
      v-model:columns="columns"
      @edit:col="
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

    <div class="flex flex-wrap gap-1 sm:gap-2">
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

const {
  columns,
  applyChangesWithCheckpoint,
  discardChanges,
  saveChanges,
  canUndoLastChange,
  canRedoLastChange,
  undoLastChange,
  redoLastChange,
} = injectColumnConfiguration();
</script>
