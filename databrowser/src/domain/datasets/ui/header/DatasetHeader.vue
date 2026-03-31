<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <header class="flex flex-wrap items-center gap-2 py-1">
    <div class="flex items-center gap-2 w-full md:w-auto justify-between">

      <!-- Dataset title -->
      <DatasetHeaderSelectDataset :has-config="hasConfig" />

      <!-- More info -->
      <DatasetHeaderMoreInfoPopup />

      <DatasetHeaderSearch
        :disabled="!isTableView"
        :open="inputSearchOpen"
        class="flex md:hidden"
        @open="handleInputSearchOpen"
      />
    </div>
    <DatasetHeaderOverlay
      :active="inputSearchOpen"
      padded
      @overlay-click="handleInputSearchOpen(false)"
    >
      <InputSearch
        :disabled="!isTableView"
        id="search-dataset"
        class="md:w-80"
        :show-confirm-button="true"
        :class="[inputSearchOpen ? 'flex' : 'hidden md:flex']"
        :model-value="searchfilter"
        @search="search"
      />
    </DatasetHeaderOverlay>

    <div class="flex items-center gap-2 w-full md:flex-1 md:justify-between">
      <div class="flex items-center w-full md:w-auto gap-2">
        <!-- filters button -->
        <DatasetHeaderButton
          :disabled="!isTableView"
          @click="openToolBoxHandler(ToolBoxSectionKey.FILTERS)"
          :label="t('datasets.header.filters')"
          :icon="OdhFilter"
          :active="isToolBoxActive(ToolBoxSectionKey.FILTERS)"
          :has-bullet="hasActiveFilters()"
        />

        <!-- Language picker -->
        <LanguagePicker
            v-if="showLanguagePicker"
            :current-language="currentLanguage"
            @language-changed="changeLanguage"
        />

        <!-- view button -->
        <ViewPicker
            v-if="showViewPicker"
            :picked="source"
            @picked-change="changeSource($event)"
        />

        <!-- attributes button -->
        <DatasetHeaderButton
          @click="openToolBoxHandler(ToolBoxSectionKey.ATTRIBUTES)"
          :label="t('datasets.header.attributes')"
          :icon="OdhAttributes"
          :active="isToolBoxActive(ToolBoxSectionKey.ATTRIBUTES)"
        />


        <!-- Show information if current view is auto generated -->
        <TagCustom
          v-if="source === 'generated'"
          :text="t('datasets.header.viewGeneratedConfig')"
          size="xs"
          type="yellow"
          has-dot
        />
      </div>

      <div class="gap-2 flex items-center w-auto justify-between">
        <!-- add new record button -->
        <AddRecordButton
          v-if="addRecordSupported"
          class="md:flex"
          data-test="desktop-add-record-link"
        />

        <!-- export button -->
        <DatasetHeaderButton
          @click="openToolBoxHandler(ToolBoxSectionKey.EXPORTS)"
          label="Export"
          class="md:flex"
          :icon="OdhExport"
          :active="isToolBoxActive(ToolBoxSectionKey.EXPORTS)"
        />

        <!-- actions button -->
        <ActionsLinksDropdown
          data-test="dataset-edit-link"
          :show-edit="showRecordEdit"
          :show-delete="showRecordDelete"
          :show-duplicate="showRecordDuplicate"
          :show-force-sync="showRecordForceSync"
          :show-push="showRecordPush"
          @edit="onEdit"
          @refresh="onRefresh"
          @sync="handleSync"
          @push="onPush"
          @duplicate="onDuplicate"
          @delete="onDelete"
        />
      </div>

    </div>


  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import InputSearch from '../../../../components/input/InputSearch.vue';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import TagCustom from '../../../../components/tag/TagCustom.vue';
import { useUserSettings } from '../../../user/userSettings';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { DatasetConfigSource } from '../../config/types';
import { useDatasetQueryStore } from '../../location/store/datasetQueryStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import { useDatasetLocationStore } from '../../location/store/useDatasetLocationStore';
import AddRecordButton from './AddRecordButton.vue';
import DatasetHeaderMoreInfoPopup from './DatasetHeaderMoreInfoPopup.vue';
import DatasetHeaderOverlay from './DatasetHeaderOverlay.vue';
import DatasetHeaderSearch from './DatasetHeaderSearch.vue';
import DatasetHeaderSelectDataset from './DatasetHeaderSelectDataset.vue';
import DatasetHeaderButton from './DatasetHeaderButton.vue';
import { useToolBoxStore } from '../toolBox/toolBoxStore';
import {ToolBoxSectionKey} from "@/domain/datasets/ui/toolBox/types";
import ViewPicker from "@/components/view/ViewPicker.vue";
import {useTableFilterStore} from "@/domain/datasets/ui/tableView/filter/tableFilterStore";
import OdhFilter from "@/components/svg/odh/OdhFilter.vue";
import OdhAttributes from "@/components/svg/odh/OdhAttributes.vue";
import OdhExport from "@/components/svg/odh/OdhExport.vue";
import ActionsLinksDropdown from '@/domain/datasets/ui/common/ActionsLinksDropdown.vue';
import { useTableLoad } from '@/domain/datasets/ui/tableView/load/useTableLoad';
import { useAuth } from '@/domain/auth/store/auth';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { usePublisherStore } from '@/domain/publisher/publisherStore';
import { useSyncSourceStore } from '@/domain/syncData/syncSourceStore';
import { useEditStore } from '@/domain/datasets/ui/editView/store/editStore';
import { usePathsForCurrentRoute } from './usePaths';
import { useSingleRecordLoadData } from '../common/load/useSingleRecordLoadData';
import { Publisher } from '@/domain/cellComponents/components/cells/pushDataCell/types';
import { useEventDelete } from '../tableView/useTableDelete';
import { RecordActionsData } from '../tableView/types';

const toolBoxStore = useToolBoxStore();
const tableFilterStore = useTableFilterStore();

const router = useRouter();
const { currentRoute } = router;
const hash = computed(() => currentRoute.value.hash);

const datasetViewStore = useDatasetViewStore();
const { isTableView, isDetailView, isEditView, hasEditView, isNewView } = storeToRefs(datasetViewStore);

const { t } = useI18n();

const datasetBaseInfoStore = useDatasetBaseInfoStore();
const { datasetDomain, hasConfig, fullPath } = storeToRefs(datasetBaseInfoStore);

const inputSearchOpen = ref<boolean>();

const handleInputSearchOpen = (state: boolean) => {
  inputSearchOpen.value = state;
};

const searchfilter = useDatasetQueryStore().handle('searchfilter');
const search = (term: string) => {
  searchfilter.value = term === '' ? undefined : term;
  handleInputSearchOpen(false);
};

const { addRecordSupported, editRecordSupported, deleteRecordSupported } = storeToRefs(useDatasetPermissionStore());

const currentLanguage = useDatasetQueryStore().handle('language');

const showLanguagePicker = computed(() => datasetDomain.value === 'tourism');
const showViewPicker = computed(() => true);

const { getUserSetting, updateUserSetting } = useUserSettings();

const source = ref(getUserSetting('preferredDatasetSource'));
watch(
  () => getUserSetting('preferredDatasetSource'),
  (newValue) => (source.value = newValue)
);

const changeSource = async (value: DatasetConfigSource) => {
  const oldSourceValue = getUserSetting('preferredDatasetSource');
  // Try to update user setting, but it may fail due to guards
  const isUpdateSuccessful = await updateUserSetting(
    'preferredDatasetSource',
    value
  );
  // If it failed, revert the local value
  if (!isUpdateSuccessful) {
    source.value = oldSourceValue;
  }
};

const { refetch } = useTableLoad();
const onRefresh = () => {
  refetch();
};
const onSync = () => {
  //TODO: implement sync all dataset
};

const isRecordView = computed(() => isDetailView.value || isEditView.value);

const auth = useAuth();
const isAuthenticated = computed(() => auth.isAuthenticated);

const { data: rawRecordData } = useSingleRecordLoadData(datasetDomain, fullPath, isNewView);
const recordData = computed(() => rawRecordData.value as RecordActionsData | undefined);

const metaId = computed(() => recordData.value?._Meta?.Id);
const metaType = computed(() => recordData.value?._Meta?.Type);
const recordSource = computed(() => recordData.value?.Source as string | undefined);

const syncSourceStore = useSyncSourceStore();

const showRecordEdit = computed(
  () => isRecordView.value && editRecordSupported.value && hasEditView.value
);
const showRecordDelete = computed(
  () => isRecordView.value && deleteRecordSupported.value
);
const showRecordDuplicate = computed(
  () => isRecordView.value && addRecordSupported.value
);
const showRecordForceSync = computed(
  () => isRecordView.value && isAuthenticated.value && syncSourceStore.hasSyncConfig(recordSource.value)
);
const showRecordPush = computed(
  () => isRecordView.value && isAuthenticated.value
);

const { editLocation } = storeToRefs(useDatasetLocationStore());
const onEdit = () => {
  if (showRecordEdit.value && editLocation.value) {
    router.push({ ...editLocation.value, hash: hash.value });
  }
};

const onDelete = () => {
  if (metaId.value) {
    useEventDelete.emit(metaId.value);
  }
};

const { newViewPath } = usePathsForCurrentRoute();
const editStore = useEditStore();
const onDuplicate = () => {
  if (!recordData.value) return;
  const newData = JSON.parse(JSON.stringify(recordData.value));
  delete newData.id;
  delete newData._Meta;
  editStore.setAction('duplicate');
  editStore.setInitial({});
  editStore.setCurrent(newData);
  router.push(newViewPath.value);
};

const { publishers } = storeToRefs(usePublisherStore());
const publishedOn = computed(() => recordData.value?.PublishedOn as string[] | null | undefined);
const publishersWithUrl = computed(() => {
  const po = publishedOn.value;
  if (!po?.length) return [];
  return publishers.value
    .filter((publisher) => po.includes(publisher.id))
    .map<Publisher>((publisher) => ({
      id: publisher.id,
      name: publisher.name,
      url: publisher.buildUrl(metaId.value, metaType.value),
    }));
});

const { openPushDialog, openSyncDialog } = useTableViewStore();
const onPush = () => {
  openPushDialog({
    id: metaId.value,
    title: 'Push data',
    publishers: publishersWithUrl.value,
  });
};

const onRecordSync = () => {
  const source = recordSource.value;
  if (source && metaType.value && metaId.value) {
    const syncUrl = syncSourceStore.buildSyncUrl(source, metaType.value, metaId.value);
    if (syncUrl) {
      openSyncDialog({
        id: metaId.value,
        title: 'Sync data',
        type: metaType.value,
        syncUrl,
      });
    }
  }
};

// In record view, the sync action should sync the current record
// In table view, it's a dataset-level sync
const handleSync = () => {
  if (isRecordView.value) {
    onRecordSync();
  } else {
    onSync();
  }
};

const changeLanguage = (value: string) => {
  updateUserSetting('preferredDatasetLanguage', value);
};


const hasActiveFilters = () => {
  return tableFilterStore.tableFilters.length > 0;
};


const isToolBoxActive = (sectionKey:ToolBoxSectionKey) => {
  return toolBoxStore.activeSectionKey === sectionKey;
};

const openToolBoxHandler = (sectionKey:ToolBoxSectionKey) => {
  toolBoxStore.toggleToolBoxSectionKey(sectionKey);
};

</script>
