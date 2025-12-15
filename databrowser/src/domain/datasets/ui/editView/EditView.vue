<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <template v-if="!auth.ready">
    {{ t('datasets.editView.authorizationChecking') }}
  </template>
  <template v-else>
    <template v-if="!editRecordSupported">
      <AlertError :title="'Error!'">
        {{ t('datasets.editView.notAuthorized') }}
      </AlertError>
    </template>
    <template v-else-if="isGeneratedSource">
      <AlertError :title="'Error!'">
        {{ t('datasets.editView.notAvailableForGeneratedSource') }}
      </AlertError>
    </template>
    <template v-else-if="!hasEditView">
      <AlertError :title="'Error!'">
        {{ t('datasets.editView.noEditViewConfigured') }}
      </AlertError>
    </template>
    <template v-else>
      <LoadingError v-if="isError">{{ error }}</LoadingError>
      <EditSaveError v-if="isMutateError" :response-errors="responseErrors" />
      <DiscardChangesDialog @discard="resetAndCleanup" />
      <LeaveSectionDialog
        :is-save-success="isMutateSuccess"
        @save-changes="saveChanges"
      />
      <GoToReferenceAttributeDialog />
      <div class="flex h-screen flex-col justify-between overflow-auto">
        <div
          class="flex grow md:overflow-y-auto"
          :class="[{ 'pointer-events-none opacity-50': isMutateLoading }]"
        >
          <div
            :class="[
              'flex md:overflow-y-auto',
              isDiffEditing ? 'w-full pr-0 md:w-1/2 md:pr-4' : 'w-full',
            ]"
          >
            <MainAndSubCategories
              class="md:border-r"
              :data="editStore.current"
              :categories="enhancedMainCategories"
              :sub-categories="enhancedSubcategories"
              :current-category="currentCategory"
              :slug="slug"
              :show-edit-hint="true"
              :editable="true"
            />
            <EditToolBox />
          </div>

          <div v-if="isDiffEditing" class="w-full md:w-1/2">
            <DiffEditor
              v-model:value="editStore.currentAsJson"
              :original="editStore.initialAsJson"
              language="json"
              theme="vs"
              height="100%"
              :options="diffEditorOptions"
              class="code-editor-container h-full rounded-md border border-gray-300"
              @editorDidMount="onDiffMounted"
            />
          </div>
        </div>
        <EditFooter
          class="fixed bottom-0 transition-all md:static"
          :is-saving="isMutateLoading"
          :is-save-disabled="false"
          :class="{ hidden: editStore.isEqual }"
          @cancel="tryToDiscardChanges"
          @save="saveChanges"
        />
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AlertError from '../../../../components/alert/AlertError.vue';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import { DatasetPage } from '@/routes';
import { useAuth } from '../../../auth/store/auth';
import {
  useEventDiscardChanges,
  useEventSaveChanges,
} from '../../../cellComponents/components/utils/editList/dialogMultipleFilesLanguage/utils';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import MainAndSubCategories from '../common/MainAndSubCategories.vue';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import { useSingleRecordMutateData } from '../common/load/useSingleRecordMutateData';
import EditFooter from '../common/editor/EditFooter.vue';
import EditSaveError from './EditSaveError.vue';
import DiscardChangesDialog from './dialogs/DiscardChangesDialog.vue';
import LeaveSectionDialog from './dialogs/LeaveSectionDialog.vue';
import { useDialogsStore } from './dialogs/dialogsStore';
import { useEditStore } from './store/editStore';
import EditToolBox from './toolBox/EditToolBox.vue';
import { useApplyError } from './useApplyError';
import { useEditStoreSync } from './useEditStoreSync';
import { useToolBoxStore } from '../toolBox/toolBoxStore';
import GoToReferenceAttributeDialog from '../common/dialogs/goToReferenceAttributeDialog/GoToReferenceAttributeDialog.vue';
import { useJsonEditorConfigurator } from '@/domain/datasets/ui/common/editor/useJsonEditorConfigurator';
import { DiffEditor } from 'monaco-editor-vue3';
import { useDatasetViewStore } from '@/domain/datasets/view/store/datasetViewStore';
import { DiffEditMode } from '@/domain/datasets/view/types';

const { t } = useI18n();

const auth = useAuth();

const { editRecordSupported } = storeToRefs(useDatasetPermissionStore());

const editStore = useEditStore();

const toolBoxStore = useToolBoxStore();

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

const {
  isError,
  data,
  error,
  fullPath,
  slug,
  categories,
  subcategories,
  currentCategory,
  hasEditView,
  isGeneratedSource,
  isNewView,
} = useSingleRecordLoad();

const {
  mutateData,
  mutateError,
  isMutateSuccess,
  isMutateLoading,
  isMutateError,
  mutate,
} = useSingleRecordMutateData(fullPath, isNewView);

const viewStore = useDatasetViewStore();
const { isDiffEditing } = storeToRefs(viewStore);

const diffEditMode = ref(DiffEditMode.VERTICAL);
const isEditEnabled = ref(false);
const { diffEditorOptions, onDiffMounted } =
  useJsonEditorConfigurator({
    diffEditMode,
    isEditEnabled,
    isDiffEditing,
    onDiffStatsChange: (a, d) => viewStore.setDiffStats(a, d),
    onDiffStatsReset: () => viewStore.resetDiffStats(),
  });

// Enhance categories and subcategories with any errors
const {
  enhancedMainCategories,
  enhancedSubcategories,
  responseErrors,
  cleanErrors,
} = useApplyError(categories, subcategories, mutateError);

// Sync data to edit store
const storeSync = useEditStoreSync(data, isMutateSuccess, mutate);

// Triggers request and sync editStore
const saveChanges = () => storeSync.mutate();

// Reset store and cleanup errors
const resetAndCleanup = () => {
  storeSync.reset();
  cleanErrors();
};

const dialogsStore = useDialogsStore();

// Cancel callback
const tryToDiscardChanges = () => {
  if (editStore.isEqual) {
    // If there are no changes, just clean everything up
    resetAndCleanup();
  } else if (!dialogsStore.isAnyDialogOpen) {
    // If there are changes and no dialog is visible, then show
    // dialog to decide if discard changes or not
    dialogsStore.discardChangesDialogVisible = true;
  }
};

// If create mutation was successful,
// redirect to detail page of new record
const router = useRouter();
watch(
  () => isMutateSuccess.value,
  (success) => {
    if (isNewView.value && success) {
      // At the moment there are at least two different forms of response
      // when a new record is created. The first one is from the EventShort
      // dataset, the second comes from the Article dataset
      const id = mutateData.value?.id ?? mutateData.value?.Value.id;
      if (id != null) {
        router.push({
          name: DatasetPage.DETAIL,
          params: { id },
        });
      }
    }
  },
  { immediate: true }
);

toolBoxStore.settings.showReferences = true;

// Listen for window close / reload event and let the user know
// if there are unsaved changes
useEventListener(window, 'beforeunload', (evt) => {
  if (!editStore.isEqual) {
    evt.returnValue = 'Do you really want to close?';
    return evt.returnValue;
  }
});
</script>
