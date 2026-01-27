// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref, ref, watch } from 'vue';
import { useMetaDataForAllDatasets } from '../../../../../pages/datasets/overview/useDatasets';
import { TourismMetaData } from '../../../../metaDataConfig/tourism/types';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { mapClusterMaxZoom, mapClusterRadius } from '../consts';
import { MapDataset } from '../types';

type RestrictedMetaData = TourismMetaData & {
  apiType: KnownApiType;
  externalLink: string;
};

export const useFetchDatasets = (): {
  datasets: Ref<MapDataset[]>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
} => {
  const datasets = ref<MapDataset[]>([]);

  const { metaData, isMetaDataLoading, metaDataError } =
    useMetaDataForAllDatasets();

  watch(metaData, (metaDataValue) => {
    // Only use valid datasets, i.e. those with a known API type and an external link
    // TODO: remove all datasets without GPS info?
    datasets.value = metaDataValue
      .filter((dataset): dataset is RestrictedMetaData => {
        if (dataset.apiType === 'unknown') {
          console.warn(
            `Dataset ${dataset.id} has unknown API type and will be ignored`
          );
          return false;
        }
        if (dataset.externalLink == null) {
          console.warn(
            `Dataset ${dataset.id} has no external link and will be ignored`
          );
          return false;
        }
        return true;
      })
      .map(buildMapDataset);
  });

  return {
    datasets,
    isLoading: isMetaDataLoading,
    error: metaDataError,
  };
};

const buildMapDataset = (dataset: RestrictedMetaData): MapDataset => ({
  api: {
    apiType: dataset.apiType,
    apiUrl: dataset.externalLink,
  },
  metaData: {
    datasetId: dataset.id,
    datasetName: dataset.shortname,
    datasetAbbreviation: dataset.shortname.substring(0, 1).toUpperCase(),
    datasetColor: stringToColor(dataset.id),
    datasetParentId: dataset.parent?.id,
    coordinateSource: dataset.coordinateSource
  },
  selected: false,
  records: {
    fetching: false,
    fetched: false,
    error: null,
    count: 0,
    source: {
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: mapClusterMaxZoom,
      clusterRadius: mapClusterRadius,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    },
  },
});

const stringToColor = (s: string, saturation = 100, lightness = 75) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
};
