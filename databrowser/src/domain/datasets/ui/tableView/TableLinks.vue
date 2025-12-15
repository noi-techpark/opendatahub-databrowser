<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="grid grid-cols-2 gap-2 text-green-400">
    <!--    <DetailsLink-->
    <!--      :to="detailLocation"-->
    <!--      :title="t('datasets.listView.viewLinks.detail.title')"-->
    <!--      data-test="dataset-detail-link"-->
    <!--    >-->
    <!--      <IconEye class="grow stroke-current" />-->
    <!--      <span class="text-3xs uppercase">-->
    <!--        {{ t('datasets.listView.viewLinks.detail.short') }}-->
    <!--      </span>-->
    <!--    </DetailsLink>-->
    <DetailsLink
      v-if="showEdit"
      :to="editLocation"
      :title="t('datasets.listView.viewLinks.edit.title')"
      data-test="dataset-edit-link"
    >
      <IconEdit class="grow stroke-current" />
      <span class="text-3xs uppercase">
        {{ t('datasets.listView.viewLinks.edit.short') }}
      </span>
    </DetailsLink>
    <DetailsLinksDropdown
      :id="recordId"
      :to="editLocation"
      :showDelete="showDelete"
      :title="t('datasets.listView.viewLinks.edit.title')"
      data-test="dataset-edit-link"
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
import IconEdit from '@/components/svg/IconEdit.vue';
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

const { t } = useI18n();

const props = defineProps<{
  recordId: RecordId;
  data: RecordActionsData;
  showEdit: boolean;
  showDelete: boolean;
}>();

const { recordId } = toRefs(props);

const { datasetDomain, datasetPath, datasetQuery } = storeToRefs(
  useDatasetBaseInfoStore()
);

const { editLocation } = useSingleRecordLocations(
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

const onDuplicate = () => {
  //TODO: implement it
};


const { publishers } = storeToRefs(usePublisherStore());
const metaId = props.data._Meta?.Id ?? undefined;
const metaType = props.data._Meta?.Type ?? undefined;
const publishedOn = props.data.PublishedOn as string[] | null | undefined;
const publishersWithUrl = computed(() => {
  if (publishedOn == null || publishedOn.length === 0) {
    return [];
  }

  return (
    publishers.value
      // Use only publishers that are in the publishedOn list
      .filter(
        (publisher) =>
          publishedOn?.find((pon) => pon === publisher.id) != null
      )
      .map<Publisher>((publisher) => ({
        id: publisher.id,
        name: publisher.name,
        url: publisher.buildUrl(metaId, metaType),
      }))
  );
});

const { openPushDialog } = useTableViewStore();
const onPush = () => {
  openPushDialog({
    id: metaId,
    title: 'Push data',
    publishers: publishersWithUrl.value,
  });
};

//
// const onPush = () => {
//   //TODO: implement it
// };
const onSync = () => {
  //TODO: implement it
};
const onOpenAnalytics = () => {
  //TODO: implement it
};
const onOpenQuality = () => {
  //TODO: implement it
};
</script>
