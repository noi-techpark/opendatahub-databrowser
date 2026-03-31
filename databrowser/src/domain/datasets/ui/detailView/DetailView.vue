<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <LoadingError v-if="isError" :error="error" />
  <template v-else>
    <div class="flex md:overflow-y-auto">
      <MainAndSubCategories
        :data="data"
        :categories="categories"
        :sub-categories="subcategories"
        :current-category="currentCategory"
        :slug="slug"
        :show-edit-hint="false"
        :editable="false"
      />

      <DetailViewToolBox :url="fullPath" :references-urls="referencesUrls"></DetailViewToolBox>
    </div>
  </template>

  <EditListDeleteDialog
    :show-dialog="deleteDialog.isVisible"
    :title="t('datasets.editView.dialog.deleteDialog.commonTitleSingular')"
    :description="t('datasets.editView.dialog.deleteDialog.commonDescriptionSingular')"
    :confirm-button-disabled="isDeleting"
    :close-button-disabled="isDeleting"
    @confirm-delete="onDeleteConfirm()"
    @close="closeDeleteConfirmation()"
  />

  <PushDataDialog
    v-if="pushDialogPayload"
    :is-open="isPushDialogOpen"
    :payload="pushDialogPayload"
  />
  <SyncDataDialog
    v-if="syncDialogPayload"
    :is-open="isSyncDialogOpen"
    :payload="syncDialogPayload"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import MainAndSubCategories from '../common/MainAndSubCategories.vue';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import DetailViewToolBox from '@/domain/datasets/ui/detailView/toolBox/DetailViewToolBox.vue';
import EditListDeleteDialog from '@/domain/cellComponents/components/utils/editList/dialogs/EditListDeleteDialog.vue';
import PushDataDialog from '@/domain/cellComponents/components/cells/pushDataCell/PushDataDialog.vue';
import SyncDataDialog from '@/domain/cellComponents/components/cells/syncDataConfigCell/SyncDataDialog.vue';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { useEventDelete } from '@/domain/datasets/ui/tableView/useTableDelete';
import { useApiMutate } from '@/domain/api/useApi';
import { useDatasetLocationStore } from '../../location/store/useDatasetLocationStore';

const { t } = useI18n();
const router = useRouter();

const {
  isError,
  data,
  error,
  fullPath,
  slug,
  categories,
  subcategories,
  currentCategory,
} = useSingleRecordLoad();

const tableViewStore = useTableViewStore();
const {
  isPushDialogOpen,
  pushDialogPayload,
  isSyncDialogOpen,
  syncDialogPayload,
} = storeToRefs(tableViewStore);

const { tableLocation } = storeToRefs(useDatasetLocationStore());

const deleteDialog = ref({
  idsToDelete: [] as string[],
  isVisible: false,
});

const deleteUrl = ref<string>();
const {
  isSuccess: isDeleteSuccess,
  mutate: deleteMutate,
  isPending: isDeleting,
} = useApiMutate(deleteUrl, { method: 'delete' });

watch(isDeleteSuccess, (newValue: boolean) => {
  if (newValue) {
    closeDeleteConfirmation();
    if (tableLocation.value) {
      router.push(tableLocation.value);
    }
  }
});

useEventDelete.on((id: string | undefined) => {
  if (id) {
    deleteDialog.value.isVisible = true;
    deleteDialog.value.idsToDelete = [id];
  }
});

const closeDeleteConfirmation = () => {
  deleteDialog.value.isVisible = false;
  deleteDialog.value.idsToDelete = [];
};

const onDeleteConfirm = () => {
  const currentBaseUrl = fullPath.value?.split('?')[0];
  for (const idToDelete of deleteDialog.value.idsToDelete) {
    deleteUrl.value = `${currentBaseUrl}/${idToDelete}`;
    deleteMutate({});
  }
};

const referencesUrls = computed(() => {
  const takenUrls = new Set<string>();

  return categories.value
    ? categories.value.flatMap((category) =>
        category.subCategories.flatMap((subCategory) => {
          const results = [];
          for (const property of subCategory.properties) {
            const referenceInfo = property.referenceInfo;
            if (
              referenceInfo &&
              referenceInfo.url &&
              !takenUrls.has(referenceInfo.url)
            ) {
              takenUrls.add(referenceInfo.url);
              results.push({
                from: referenceInfo.from || referenceInfo.url,
                url: referenceInfo.url,
              });
            }
          }
          return results;
        })
      )
    : [];
});
</script>
