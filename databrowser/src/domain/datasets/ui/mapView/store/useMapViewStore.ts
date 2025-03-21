// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { markRaw, watch } from 'vue';
import { axiosWithMaybeAuth } from '../../../../api/apiAuth';
import { unwrapData } from '../../../../api/dataExtraction';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { toError } from '../../../../utils/convertError';
import { DatasetId, DatasetRecords, MapDataset, RecordId } from '../types';
import { computeMapSource } from './computeMapSource';
import { useFetchDatasets } from './useFetchDatasets';
import { useMapViewUiStore } from './useMapViewUiStore';
import { getDatasetUrl, getRecordUrl } from './utils';

interface State {
  datasets: Record<DatasetId, MapDataset>;
  datasetsFetching: boolean;
  datasetsFetched: boolean;
  datasetsFetchError: Error | null;
}

const initialState: State = {
  datasets: {},
  datasetsFetching: true,
  datasetsFetched: false,
  datasetsFetchError: null,
};

export const useMapViewStore = defineStore('mapViewStore', {
  state: () => initialState,
  getters: {
    datasetCount(): number {
      return Object.keys(this.datasets).length;
    },
    selectedDatasets(): Record<DatasetId, MapDataset> {
      return Object.fromEntries(
        Object.entries(this.datasets).filter(([, dataset]) => dataset.selected)
      );
    },
    selectedDatasetCount(): number {
      return Object.values(this.selectedDatasets).filter(
        (dataset) => dataset.selected
      ).length;
    },
    selectedDatasetRecordsCount(): number {
      return Object.values(this.selectedDatasets).reduce(
        (prev, dataset) => prev + dataset.records.count,
        0
      );
    },
    isDatasetSelected(): (datasetId: DatasetId) => boolean {
      return (datasetId: DatasetId) => this.datasets[datasetId].selected;
    },
    selectedAndLoadedDatasets(): Record<DatasetId, MapDataset> {
      return Object.fromEntries(
        Object.entries(this.selectedDatasets).filter(
          ([, dataset]) => dataset.records.fetched
        )
      );
    },
  },
  actions: {
    setSelectedDataset(datasetId: DatasetId, selected: boolean): void {
      if (this.datasets[datasetId] == null) {
        throw new Error(`Dataset with ID ${datasetId} not found`);
      }
      this.datasets[datasetId].selected = selected;
      const { datasetIds } = storeToRefs(useMapViewUiStore());
      datasetIds.value = Object.keys(this.selectedDatasets);
    },
    async fetchDatasets(): Promise<Record<DatasetId, MapDataset>> {
      if (this.datasetsFetched) {
        console.log('Datasets already fetched');
        return Promise.resolve(this.datasets);
      }

      const { datasets, isLoading, error } = useFetchDatasets();

      const { resolve, reject, promise } =
        Promise.withResolvers<Record<DatasetId, MapDataset>>();

      // Watch the dataset loading state
      const stopLoadingWatcher = watch(isLoading, async () => {
        if (isLoading.value) {
          return;
        }

        // Stop the watcher after data is loaded, it is not needed anymore
        stopLoadingWatcher();

        if (error.value != null) {
          this.datasetsFetching = false;
          this.datasetsFetched = true;
          this.datasetsFetchError = error.value;
          reject(error.value);
          return;
        }

        this.datasets = Object.fromEntries(
          datasets.value.map((dataset) => [
            dataset.metaData.datasetId,
            markRaw(dataset),
          ])
        );

        this.datasetsFetching = false;
        this.datasetsFetched = true;
        this.datasetsFetchError = null;

        return resolve(this.datasets);
      });

      return promise;
    },
    // Fetch all records
    async fetchRecordsForDatasetId(
      datasetId: DatasetId
    ): Promise<DatasetRecords> {
      const dataset = this.datasets[datasetId];
      if (dataset == null) {
        throw new Error(`Dataset with ID ${datasetId} not found`);
      }

      if (dataset.records.fetched) {
        console.log(`Records for dataset ${datasetId} already fetched`);
        return dataset.records;
      }

      try {
        this.datasets[datasetId].records.fetching = true;
        this.datasets[datasetId].records.fetched = false;
        this.datasets[datasetId].records.error = null;

        const apiType = dataset.api.apiType;

        const axiosInstance = await axiosWithMaybeAuth(true, apiType);

        const fetchUrl = getDatasetUrl(dataset.api);
        const responseData = await axiosInstance.get<unknown>(fetchUrl);

        const records = unwrapData<unknown[]>(responseData.data);
        const mapSource = computeMapSource(apiType, records);

        this.datasets[datasetId].records.fetching = false;
        this.datasets[datasetId].records.fetched = true;
        this.datasets[datasetId].records.source = mapSource;
        this.datasets[datasetId].records.count = records.length;

        return this.datasets[datasetId].records;
      } catch (error: unknown) {
        this.datasets[datasetId].records.fetching = false;
        this.datasets[datasetId].records.fetched = false;
        this.datasets[datasetId].records.error = toError(error).message;
        throw new Error(toError(error).message, { cause: error });
      }
    },
    // Fetch record details
    async fetchRecordDetails(
      datasetId: DatasetId,
      recordId: RecordId
    ): Promise<{
      data: unknown;
      url: string;
      apiType: KnownApiType;
    }> {
      const dataset = this.datasets[datasetId];
      if (dataset == null) {
        throw new Error(`Dataset with ID ${datasetId} not found`);
      }

      try {
        const { apiType, apiUrl } = dataset.api;
        const url = getRecordUrl(apiType, apiUrl, recordId);
        const axiosInstance = await axiosWithMaybeAuth(true, apiType);
        const data = (await axiosInstance.get<unknown>(url)).data;

        switch (apiType) {
          case 'content':
            return { data, url, apiType };
          case 'timeseries':
            return {
              data: Array.isArray(data) ? data[0] : data,
              url,
              apiType,
            };
        }
      } catch (error: unknown) {
        throw new Error(toError(error).message, { cause: error });
      }
    },
  },
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapViewStore, import.meta.hot));
}
