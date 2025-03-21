// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Map } from 'maplibre-gl';
import { Ref } from 'vue';

export type ClusterMapInitializer = (map: Map) => void;

export interface LayerId {
  clusteredId: string;
  unclusteredId: string;
}

export interface ClusterMapLayerTracker {
  layerIds: Readonly<Ref<LayerId[]>>;
  layerIdsByDatasetId: Readonly<
    Ref<{
      readonly [x: string]: {
        readonly clusteredId: string;
        readonly unclusteredId: string;
      };
    }>
  >;
  addLayerId: (datasetId: string, layerId: LayerId) => void;
  removeLayerId: (datasetId: string) => void;
  hasLayerId: (datasetId: string) => boolean;
}
