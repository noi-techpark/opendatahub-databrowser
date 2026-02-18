<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="grid grid-cols-2 gap-2 text-green-400">

    <DetailsLink
      :to="detailLocation"
      :title="t('datasets.listView.viewLinks.detail.title')"
      data-test="dataset-detail-link"
    >
      <IconEye class="grow stroke-current" />
      <span class="text-3xs uppercase">
        {{ t('datasets.listView.viewLinks.detail.short') }}
      </span>
    </DetailsLink>
    <DetailsLinksDropdown
      :id="recordId"
      :showDelete="showDelete"
      :showEdit="showEdit"
      :showForceSync="showForceSync"
      :showPush="showPush"
      :showDuplicate="addRecordSupported"
      :title="t('datasets.listView.viewLinks.edit.title')"
      data-test="dataset-edit-link"
      @edit="onEdit"
      @delete="onDelete"
      @refresh="onRefresh"
      @duplicate="onDuplicate"
      @push="onPush"
      @sync="onSync"
      @openAnalytics="onOpenAnalytics"
      @openQuality="onOpenQuality"
    >
    </DetailsLinksDropdown>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { RecordId } from '@/domain/datasets/types';
import { useDatasetBaseInfoStore } from '../../config/store/datasetBaseInfoStore';
import { useSingleRecordLocations } from '../../location/datasetViewLocation';
import DetailsLink from './details/DetailsLink.vue';
import { useEventDelete } from './useTableDelete';
import DetailsLinksDropdown from '@/domain/datasets/ui/tableView/details/DetailsLinksDropdown.vue';
import { useTableLoad } from '@/domain/datasets/ui/tableView/load/useTableLoad';
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { usePublisherStore } from '@/domain/publisher/publisherStore';
import { Publisher } from '@/domain/cellComponents/components/cells/pushDataCell/types';
import { RecordActionsData } from '@/domain/datasets/ui/tableView/types';
import { useRouter } from 'vue-router';
import IconEye from '@/components/svg/IconEye.vue';
import { useDatasetPermissionStore } from '@/domain/datasets/permission/store/datasetPermissionStore.ts';
import { usePathsForCurrentRoute } from '@/domain/datasets/ui/header/usePaths.ts';
import { useEditStore } from '@/domain/datasets/ui/editView/store/editStore.ts';
import { useSync } from '@/domain/cellComponents/components/cells/syncDataConfigCell/useSync.ts';

const { t } = useI18n();
const router = useRouter();
const { currentRoute } = router;
const hash = computed(() => currentRoute.value.hash);

const props = defineProps<{
  recordId: RecordId;
  data: RecordActionsData;
  showEdit: boolean;
  showDelete: boolean;
  showForceSync: boolean;
  showPush: boolean;
}>();

const { recordId,data } = toRefs(props);

const { addRecordSupported } = storeToRefs(useDatasetPermissionStore());

const { datasetDomain, datasetPath, datasetQuery } = storeToRefs(
  useDatasetBaseInfoStore()
);

const { detailLocation, editLocation } = useSingleRecordLocations(
  datasetDomain,
  datasetPath,
  datasetQuery,
  recordId
);

const { refetch } = useTableLoad();
const onRefresh = () => {
  refetch();
};
const onDelete = () => {
  useEventDelete.emit(recordId.value);
};
const onEdit = () => {
  if (props.showEdit && editLocation) {
    router.push({ ...editLocation.value, hash: hash.value });
  }
};

const { newViewPath } = usePathsForCurrentRoute();
const editStore = useEditStore();
const onDuplicate = () => {
  precompileNewViewData(data.value);
  router.push(newViewPath.value);
};
const precompileNewViewData = (data: RecordActionsData) => {
  //copy the data
  const newData = JSON.parse(JSON.stringify(data));

  // set fields to new data
  delete newData.id;
  delete newData._Meta;

  // init edit store
  editStore.setAction('duplicate');
  editStore.setInitial({});
  editStore.setCurrent(newData);
};

const { publishers } = storeToRefs(usePublisherStore());
const metaId = computed(() => data.value._Meta?.Id);
const metaType = computed(() => data.value._Meta?.Type);
const publishedOn = computed(() => data.value.PublishedOn as string[] | null | undefined);
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


const { openPushDialog } = useTableViewStore();
const onPush = () => {
  openPushDialog({
    id: metaId.value,
    title: 'Push data',
    publishers: publishersWithUrl.value,
  });
};

const { sendSync } = useSync();
const onSync = () => {
  if(metaType.value && metaId.value){
    sendSync(metaType.value, metaId.value);
  }
};

const onOpenAnalytics = () => {
  //TODO: implement it
};
const onOpenQuality = () => {
  //TODO: implement it
};
</script>
