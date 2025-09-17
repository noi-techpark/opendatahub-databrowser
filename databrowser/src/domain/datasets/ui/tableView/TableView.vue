<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <section class="flex flex-1 flex-col justify-start overflow-y-auto">
    <TableFilterHint />

    <div class="flex flex-1 overflow-y-auto">
      <div v-if="isError" class="grow">
        <LoadingError>{{ error }}</LoadingError>
      </div>
      <div v-else class="flex flex-1 flex-col overflow-y-auto">
        <TableContent
            :cols="cols"
            :rows="rows"
            :show-detail="hasDetailView"
            :show-edit="editRecordSupported"
            :show-delete="deleteRecordSupported"
            :dataset-domain="datasetDomain"
        />
      </div>

      <TableViewToolBox :url="fullPath" :pagination="pagination" />
    </div>

    <DatasetFooter :pagination="pagination" />

  </section>

  <EditListDeleteDialog
    :show-dialog="deleteDialog.isVisible"
    :title="
      deleteDialog.idsToDelete.length === 1
        ? t('datasets.editView.dialog.deleteDialog.commonTitleSingular')
        : t('datasets.editView.dialog.deleteDialog.commonTitlePlural')
    "
    :description="
      deleteDialog.idsToDelete.length === 1
        ? t('datasets.editView.dialog.deleteDialog.commonDescriptionSingular')
        : t('datasets.editView.dialog.deleteDialog.commonDescriptionPlural')
    "
    :confirm-button-disabled="isDeleting"
    :close-button-disabled="isDeleting"
    @confirm-delete="onDelete()"
    @close="closeDeleteConfirmation()"
  />
  <GoToReferenceAttributeDialog />

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

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import LoadingError from '../../../../components/loading/LoadingError.vue';
import TableContent from './TableContent.vue';
import DatasetFooter from '../common/DatasetFooter.vue';
import TableFilterHint from './filter/TableFilterHint.vue';
import { useTableLoad } from './load/useTableLoad';
import { useTableViewRouteQueryStore } from './tableViewRouteQueryStore';
import EditListDeleteDialog from '../../../cellComponents/components/utils/editList/dialogs/EditListDeleteDialog.vue';
import TableViewToolBox from './toolBox/TableViewToolBox.vue';
import { useTableDelete } from './useTableDelete';
import GoToReferenceAttributeDialog from '../common/dialogs/goToReferenceAttributeDialog/GoToReferenceAttributeDialog.vue';
import PushDataDialog from '@/domain/cellComponents/components/cells/pushDataCell/PushDataDialog.vue';
import SyncDataDialog from '@/domain/cellComponents/components/cells/syncDataConfigCell/SyncDataDialog.vue';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';

const { t } = useI18n();

const {
  cols,
  rows,
  pagination,
  isError,
  error,
  hasDetailView,
  editRecordSupported,
  deleteRecordSupported,
  fullPath,
  datasetDomain,
  refetch,
} = useTableLoad();

const tableViewStore = useTableViewStore();
const { isPushDialogOpen,pushDialogPayload, isSyncDialogOpen, syncDialogPayload } = storeToRefs(tableViewStore);


const { deleteDialog, onDelete, isDeleting, closeDeleteConfirmation } =
  useTableDelete(fullPath, refetch);

// Store TableView route query in a store for later use e.g. in DetailView
// to keep the query params when switching between DetailView and TableView.
const { currentRoute } = useRouter();
const { setRouteQuery } = useTableViewRouteQueryStore();
watch(currentRoute, ({ query }) => setRouteQuery(query), { immediate: true });

</script>
