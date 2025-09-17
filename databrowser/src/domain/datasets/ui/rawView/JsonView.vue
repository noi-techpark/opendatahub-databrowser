<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <LoadingError v-if="isError" :error="error" />
  <template v-else>

    <div class="flex min-h-[calc(100vh-155px)] flex-col bg-white">

      <LoadingError v-if="isError">{{ error }}</LoadingError>
      <EditSaveError v-if="isMutateError" :response-errors="responseErrors" />
      <DiscardChangesDialog @discard="resetAndCleanup" />
      <LeaveSectionDialog
        :is-save-success="isMutateSuccess"
        @save-changes="saveChanges"
      />
      <div class="flex-1 overflow-y-auto md:flex">
        <ContentAlignmentX
          class="flex-1 gap-4 overflow-y-hidden py-0 pb-20 md:flex md:px-0 md:pb-0"
        >
          <div v-if="isLoading" class="w-full">
            <LoadingCell v-for="i in 10" :key="i" class="my-3" />
          </div>
          <template v-else>
            <CodeEditor
              v-if="!isDiffEditing"
              v-model:value="currentJson"
              language="json"
              theme="vs"
              height="100%"
              class="code-editor-container flex-1 rounded-md border border-gray-300"
              :options="editorOptions"
            />
            <DiffEditor
              v-else
              v-model:value="currentJson"
              :original="editStore.initialAsJson"
              language="json"
              theme="vs"
              height="100%"
              :options="diffEditorOptions"
              class="code-editor-container flex-1 rounded-md border border-gray-300"
              @editorDidMount="onDiffMounted"
            />
          </template>
        </ContentAlignmentX>

        <DetailToolBox :url="fullPath" />
      </div>

      <EditFooter
        class="transition-all md:static"
        :is-saving="isMutateLoading"
        :class="{ hidden: editStore.isEqual }"
        @cancel="tryToDiscardChanges"
        @save="saveChanges"
      />
    </div>
  </template>
</template>


<script setup lang="ts">
import { watch, onUnmounted, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { useSingleRecordLoad } from '@/domain/datasets/ui/common/load/useSingleRecordLoad';
import ContentAlignmentX from '@/components/content/ContentAlignmentX.vue';
import LoadingError from '@/components/loading/LoadingError.vue';
import LoadingCell from '@/domain/cellComponents/components/cells/loadingCell/LoadingCell.vue';
import { CodeEditor, DiffEditor } from 'monaco-editor-vue3';
import { useDatasetViewStore } from '@/domain/datasets/view/store/datasetViewStore';
import DetailToolBox from '@/domain/datasets/ui/detailView/toolBox/DetailToolBox.vue';
import EditFooter from '@/domain/datasets/ui/common/editor/EditFooter.vue';
import { useEditStoreSync } from '@/domain/datasets/ui/editView/useEditStoreSync.ts';
import { useEditStore } from '@/domain/datasets/ui/editView/store/editStore.ts';
import {
  useEventDiscardChanges,
  useEventSaveChanges,
} from '@/domain/cellComponents/components/utils/editList/dialogMultipleFilesLanguage/utils.ts';
import { useDialogsStore } from '@/domain/datasets/ui/editView/dialogs/dialogsStore.ts';
import { useApplyError } from '@/domain/datasets/ui/editView/useApplyError.ts';
import { useSingleRecordMutateData } from '@/domain/datasets/ui/common/load/useSingleRecordMutateData.ts';
import LeaveSectionDialog from '@/domain/datasets/ui/editView/dialogs/LeaveSectionDialog.vue';
import EditSaveError from '@/domain/datasets/ui/editView/EditSaveError.vue';
import DiscardChangesDialog from '@/domain/datasets/ui/editView/dialogs/DiscardChangesDialog.vue';
import { useJsonEditorConfigurator } from '@/domain/datasets/ui/common/editor/useJsonEditorConfigurator.ts';

const {
  isError,
  isLoading,
  data,
  error,
  fullPath,
  categories,
  subcategories,
  isNewView,
} = useSingleRecordLoad();

const viewStore = useDatasetViewStore();
const { diffEditMode, isRawEditing, isDiffEditing } = storeToRefs(viewStore);

const editStore = useEditStore();

const currentJson = computed({
  get: () => editStore.currentAsJson,
  set: (val: string) => {
    try {
      const parsed = JSON.parse(val || '{}');
      editStore.setCurrent(parsed);
    } catch (e) {
      //todo: handle json parse error
      console.warn('Invalid JSON in editor:', e);
    }
  },
});

const { editorOptions, diffEditorOptions, onDiffMounted } =
  useJsonEditorConfigurator({
    diffEditMode,
    isEditEnabled: isRawEditing,
    isDiffEditing,
    onDiffStatsChange: (a, d) => viewStore.setDiffStats(a, d),
    onDiffStatsReset: () => viewStore.resetDiffStats(),
  });

//calculate diff status
watch(isDiffEditing, (v) => {
  if (!v) viewStore.resetDiffStats();
});
onUnmounted(() => viewStore.resetDiffStats());

//edit footer to be merged with the editView footer
useEventSaveChanges.on((value: boolean) => {
  if (value) {
    saveChanges();
  }
});
useEventDiscardChanges.on((value: boolean) => {
  if (value) {
    resetAndCleanup();
  }
});

// cancel callback
const dialogsStore = useDialogsStore();
const tryToDiscardChanges = () => {
  if (editStore.isEqual) {
    resetAndCleanup();
  } else if (!dialogsStore.isAnyDialogOpen) {
    dialogsStore.discardChangesDialogVisible = true;
  }
};

const { isMutateError, mutateError, isMutateSuccess, isMutateLoading, mutate } =
  useSingleRecordMutateData(fullPath, isNewView);

// Enhance categories and subcategories with any errors
const { responseErrors, cleanErrors } = useApplyError(
  categories,
  subcategories,
  mutateError
);

// Sync data to edit store
const storeSync = useEditStoreSync(data, isMutateSuccess, mutate);
// Triggers request and sync editStore
const saveChanges = () => storeSync.mutate();

// Reset store and cleanup errors
const resetAndCleanup = () => {
  storeSync.reset();
  cleanErrors();
};
</script>

<style scoped></style>
