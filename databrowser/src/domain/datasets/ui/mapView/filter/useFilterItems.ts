// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed } from 'vue';
import { useMapViewStore } from '../store/useMapViewStore';
import { SelectDatasetItem } from './types';
import { MapDataset } from '../types';

export const useFilterItems = () => {
  const filterItems = computed<SelectDatasetItem[]>(() => {
    const mapFilterStore = useMapViewStore();
    // Split datasets into parent and child datasets
    const datasets = Object.values(mapFilterStore.datasets);

    const parentDatasets = datasets.filter(
      (d) => d.metaData.datasetParentId == null
    );
    const childDatasets = datasets.filter(
      (d) => d.metaData.datasetParentId != null
    );

    const datasetsByParent = parentDatasets.reduce<
      Record<string, SelectDatasetItem>
    >((prev, curr) => {
      prev[curr.metaData.datasetId] = {
        ...buildItem(curr),
        children: childDatasets
          .filter(
            (childDataset) =>
              childDataset.metaData.datasetParentId === curr.metaData.datasetId
          )
          .map((childDataset) => buildItem(childDataset))
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
      return prev;
    }, {});

    return Object.values(datasetsByParent).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  return { filterItems };
};

const buildItem = ({ metaData, records, selected }: MapDataset) => {
  return {
    id: metaData.datasetId,
    name: metaData.datasetName,
    fetching: records.fetching,
    fetched: records.fetched,
    error: records.error,
    count: records.count,
    color: metaData.datasetColor,
    selected,
    children: [],
  };
};
