<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <DialogFullScreen :is-open="true">
    <div class="flex h-full flex-col overflow-auto">
      <MapViewHeader @close="emit('close')" />
      <MapViewBody />
    </div>
  </DialogFullScreen>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import DialogFullScreen from '../../../../components/dialog/DialogFullScreen.vue';
import MapViewBody from './MapViewBody.vue';
import MapViewHeader from './MapViewHeader.vue';
import { useMapViewStore } from './store/useMapViewStore';
import { useMapViewUiStore } from './store/useMapViewUiStore';
import { MarkerFeature } from './types';

const emit = defineEmits<{ (e: 'close'): void }>();

// Handle dataset selection from URL
const { datasetIds, activeMarker, activeRecord, showMarkerDetail } =
  storeToRefs(useMapViewUiStore());

// Initial dataset fetching
const mapViewStore = useMapViewStore();

const { datasets } = storeToRefs(mapViewStore);

mapViewStore.fetchDatasets().then(() => {
  if (datasetIds.value == null) {
    return;
  }
  datasetIds.value
    .filter((datasetId) => datasets.value[datasetId] != null)
    .forEach((datasetId) => {
      datasets.value[datasetId].selected = true;
      // Note that we don't await here, as we don't want to block the
      // loading of other datasets
      mapViewStore.fetchRecordsForDatasetId(datasetId).then((records) => {
        console.log(`Records for dataset ${datasetId} fetched`);

        if (activeRecord.value != null) {
          console.log('Fetch active record:', activeRecord.value);

          const { datasetId: markerDatasetId, recordId: markerRecordId } =
            activeRecord.value;

          const record = records.source.data.features.find(
            (feature) => feature.properties.recordId === markerRecordId
          );
          if (record != null) {
            mapViewStore
              .fetchRecordDetails(markerDatasetId, markerRecordId)
              .then(() => {
                const dataset = datasets.value[datasetId];

                const marker: MarkerFeature = {
                  datasetId: markerDatasetId,
                  recordId: markerRecordId,
                  name: record.properties.recordName,
                  abbreviation: dataset.metaData.datasetAbbreviation,
                  color: dataset.metaData.datasetColor,
                };

                activeMarker.value = marker;
                showMarkerDetail.value = true;
              });
          }
        }
      });
    });
});
</script>
