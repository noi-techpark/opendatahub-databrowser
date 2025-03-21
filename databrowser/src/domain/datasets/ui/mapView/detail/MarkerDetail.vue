<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-col gap-2 break-words">
    <div>
      <span class="text-sm font-semibold">ID: </span>
      {{ activeMarker.recordId }}
    </div>

    <IconCycle
      v-if="isLoading"
      class="loading-indicator mt-4 animate-spin self-center text-dialog"
    />
    <template v-else>
      <AlertError v-if="error != null" title="Error">
        {{ error.message }}
      </AlertError>
      <template v-else>
        <div v-for="(element, index) in viewElements" :key="index">
          <span class="text-sm font-semibold">{{ element.title }}: </span>
          <ComponentRenderer
            :tag-name="element.component"
            :attributes="
              buildTargetFromMapping(recordData, element, element.params)
            "
          />
        </div>
        <RecordDetailLinks :dataset-id="datasetId" :links="links" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import AlertError from '../../../../../components/alert/AlertError.vue';
import ComponentRenderer from '../../../../../components/componentRenderer/ComponentRenderer.vue';
import IconCycle from '../../../../../components/svg/IconCycle.vue';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { getApiDomainFromMetaData } from '../../../../metaDataConfig/utils';
import { toError } from '../../../../utils/convertError';
import { buildTargetFromMapping } from '../../../config/mapping/utils';
import { computeDatasetViewLocations } from '../../../location/datasetViewLocation';
import { useMapViewStore } from '../store/useMapViewStore';
import { MarkerFeature } from '../types';
import RecordDetailLinks from './RecordDetailLinks.vue';
import { useCurrentDataset } from './useCurrentDataset';
import { useViewElements } from './useViewElements';

const props = defineProps<{ activeMarker: MarkerFeature }>();
const { activeMarker } = toRefs(props);

const datasetId = computed(() => activeMarker.value.datasetId);
const recordId = computed(() => activeMarker.value.recordId);

const mapViewStore = useMapViewStore();

const recordData = ref<unknown>();
const recordUrl = ref<string>();
const recordApiType = ref<KnownApiType>();
const isLoading = ref(false);
const error = ref<Error | null>(null);

watch(
  [datasetId, recordId],
  async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data, url, apiType } = await mapViewStore.fetchRecordDetails(
        datasetId.value,
        recordId.value
      );

      recordData.value = data;
      recordUrl.value = url;
      recordApiType.value = apiType;
    } catch (err) {
      error.value = toError(err);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const { viewElements } = useViewElements(recordApiType, recordUrl);

const { currentDataset } = useCurrentDataset(datasetId);
const links = computed(() => {
  if (currentDataset.value == null || activeMarker.value == null) {
    return;
  }

  const domain = getApiDomainFromMetaData(currentDataset.value);
  const pathSegments = currentDataset.value.pathSegments;
  const query = currentDataset.value.apiFilter;
  const id = activeMarker.value.recordId;

  return computeDatasetViewLocations(domain, pathSegments, query, id);
});
</script>
