<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex h-full flex-col gap-2 break-words">
    <InputSearch v-model="searchTerm" :show-confirm-button="false" />
    <div ref="containterRel" class="relative h-full">
      <div class="absolute h-full w-full">
        <div v-bind="containerProps" :style="`height: ${height}px`">
          <div v-bind="wrapperProps">
            <div
              v-for="item in virtualList"
              :key="item.index"
              class="truncate py-px"
            >
              <InternalLink
                :to="item.data.route"
                target="_blank"
                :title="item.data.name"
              >
                {{ item.data.name }}
              </InternalLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize, useVirtualList } from '@vueuse/core';
import { computed, ref, toRefs, watch } from 'vue';
import InputSearch from '../../../../../components/input/InputSearch.vue';
import InternalLink from '../../../../../components/link/InternalLink.vue';
import {
  apiDomainToApiType,
  getApiDomainFromMetaData,
} from '../../../../metaDataConfig/utils';
import { computeDatasetViewLocations } from '../../../location/datasetViewLocation';
import { DatasetLocationRoute } from '../../../location/types';
import { ClusterFeature } from '../types';
import { ClusterDetailLink } from './types';
import { useCurrentDataset } from './useCurrentDataset';
import { useLinkSearch } from './useLinkSearch';

const emit = defineEmits<{
  (e: 'tableLink', link: DatasetLocationRoute): void;
}>();

const props = defineProps<{ activeCluster: ClusterFeature }>();
const { activeCluster } = toRefs(props);

const datasetId = computed(() => activeCluster.value.datasetId);

const { currentDataset } = useCurrentDataset(datasetId);

const baseLinkTarget = computed<
  | {
      domain: string;
      pathSegments: string[];
      query: Record<string, string>;
    }
  | undefined
>(() => {
  if (currentDataset.value == null) {
    return;
  }

  return {
    domain: getApiDomainFromMetaData(currentDataset.value),
    pathSegments: currentDataset.value.pathSegments,
    query: currentDataset.value.apiFilter,
  };
});

watch([activeCluster, baseLinkTarget], () => {
  if (baseLinkTarget.value == null) {
    return;
  }
  const { domain, pathSegments, query } = baseLinkTarget.value;

  const { tableLocation } = computeDatasetViewLocations(
    domain,
    pathSegments,
    query
  );

  if (tableLocation == null) {
    return;
  }

  const apiDomain = apiDomainToApiType(domain);
  if (apiDomain === 'content') {
    const convexHull = activeCluster.value.convexHull;
    if (convexHull == null) {
      return;
    }

    const wktPolygon = convexHull.geometry.coordinates[0]
      .map((coord) => coord.join(' '))
      .join(',');

    emit('tableLink', {
      ...tableLocation,
      query: {
        ...tableLocation.query,
        polygon: `POLYGON((${wktPolygon}))`,
      },
    });
  } else if (apiDomain === 'timeseries') {
    const bbox = activeCluster.value.bbox;
    if (bbox == null) {
      return;
    }

    emit('tableLink', {
      ...tableLocation,
      query: {
        ...tableLocation.query,
        where: `scoordinate.bbi.(${bbox.join(',')})`,
      },
    });
  }
});

const allDetailRoutes = computed<ClusterDetailLink[]>(() => {
  if (
    activeCluster.value == null ||
    currentDataset.value == null ||
    baseLinkTarget.value == null
  ) {
    return [];
  }

  const { domain, pathSegments, query } = baseLinkTarget.value;

  return activeCluster.value.markers
    .map((marker) => {
      const { detailLocation } = computeDatasetViewLocations(
        domain,
        pathSegments,
        query,
        marker.recordId
      );

      if (detailLocation == null) {
        return null;
      }

      return {
        name: marker.recordName,
        route: detailLocation,
      };
    })
    .filter((link) => link != null)
    .sort((a, b) => a.name.localeCompare(b.name));
});

const { searchTerm, searchResults } = useLinkSearch(allDetailRoutes);

const containterRel = ref(null);
const { height } = useElementSize(containterRel);

const {
  list: virtualList,
  containerProps,
  wrapperProps,
} = useVirtualList(searchResults, { itemHeight: 22 });
</script>
