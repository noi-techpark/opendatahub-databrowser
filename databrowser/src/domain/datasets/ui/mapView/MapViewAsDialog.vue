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
import { MapSourcesByGeometryType, MapSourceSpecification, MarkerFeature, RecordId } from './types';
import { isMultiGeometrySource } from "./cluster/useMapViewLayerHandler.ts"
import { Feature, Geometry } from 'geojson';

const emit = defineEmits<{ (e: 'close'): void }>();

// Handle dataset selection from URL
const { datasetIds, activeMarker, activeRecord, showMarkerDetail } =
  storeToRefs(useMapViewUiStore());

// Initial dataset fetching
const mapViewStore = useMapViewStore();

const { datasets } = storeToRefs(mapViewStore);

const validateActiveRecord = (source: MapSourceSpecification | MapSourcesByGeometryType, markerRecordId: string | undefined): 
Feature<Geometry, {
    recordId: RecordId;
    recordName: string;
}> | null | undefined => {
  if (!isMultiGeometrySource(source)) {
    return (source as MapSourceSpecification).data.features.find(
      (feature) => feature.properties.recordId === markerRecordId
    )
  }
  const allSources = Object.values(source as MapSourcesByGeometryType).filter(
    (s): s is MapSourceSpecification => s != null
  );

  const allFeatures = allSources.flatMap((source) => source.data.features);

  return allFeatures.find(
    (feature) => feature.properties.recordId === markerRecordId
  );
}

mapViewStore.fetchDatasets().then(() => {
  console.log(datasetIds.value)
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

          const record = validateActiveRecord(records.source, markerRecordId);
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
