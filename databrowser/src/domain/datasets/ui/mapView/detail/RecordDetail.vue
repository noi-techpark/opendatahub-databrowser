<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    v-if="hasFeatureProps != null"
    class="flex h-full flex-col divide-y overflow-hidden rounded-lg bg-white shadow-lg"
  >
    <!-- Header -->
    <div class="flex justify-between p-4">
      <div class="flex gap-3">
        <template v-if="activeMarker != null">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold"
            :style="`background-color: ${activeMarker.color}`"
          >
            {{ activeMarker.abbreviation }}
          </div>
          <span class="mt-0.5 text-xl">{{ activeMarker.name }}</span>
        </template>
        <template v-if="activeCluster != null">
          <div class="flex flex-col">
            <span class="self-center">
              {{
                t('datasets.mapView.recordDetail.clusterHeader', {
                  name: activeCluster.name,
                  count: activeCluster.markers.length,
                })
              }}
            </span>
            <div class="flex items-center gap-2">
              <InternalLink v-if="tableLink" :to="tableLink">
                {{ t('datasets.mapView.recordDetail.clusterToTable.title') }}'
              </InternalLink>
              <InfoPopover :z-index="mapViewSubComponentZIndex">
                <PopoverCustomPanel>
                  <PopoverContentHeader class="pb-0">
                    {{
                      t('datasets.mapView.recordDetail.clusterToTable.header')
                    }}'
                  </PopoverContentHeader>
                  <PopoverContent class="flex max-w-sm flex-col gap-3 pt-2">
                    {{
                      t('datasets.mapView.recordDetail.clusterToTable.body')
                    }}'
                  </PopoverContent>
                </PopoverCustomPanel>
              </InfoPopover>
            </div>
          </div>
        </template>
      </div>

      <ButtonCustom
        :variant="Variant.ghost"
        :size="Size.xs"
        class="flex size-9 shrink-0 items-center justify-center"
        @click="emit('close')"
      >
        <IconClose />
      </ButtonCustom>
    </div>

    <!-- Body -->
    <div
      class="flex flex-col justify-between p-4"
      :class="{
        'overflow-y-auto overflow-x-hidden': activeMarker != null,
        'h-full': activeCluster != null,
      }"
    >
      <MarkerDetail v-if="activeMarker != null" :active-marker="activeMarker" />
      <ClusterDetail
        v-if="activeCluster != null"
        :active-cluster="activeCluster"
        @table-link="tableLink = $event"
      />
    </div>
  </div>
  <div v-else>{{ t('datasets.mapView.recordDetail.featureNotFound') }}</div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '../../../../../components/button/types';
import InternalLink from '../../../../../components/link/InternalLink.vue';
import IconClose from '../../../../../components/svg/IconClose.vue';
import { DatasetLocationRoute } from '../../../location/types';
import { ClusterFeature, MarkerFeature } from '../types';
import ClusterDetail from './ClusterDetail.vue';
import MarkerDetail from './MarkerDetail.vue';
import InfoPopover from '../../../../../components/popover/InfoPopover.vue';
import PopoverCustomPanel from '../../../../../components/popover/PopoverCustomPanel.vue';
import PopoverContentHeader from '../../../../../components/popover/PopoverContentHeader.vue';
import PopoverContent from '../../../../../components/popover/PopoverContent.vue';
import { mapViewSubComponentZIndex } from '../consts';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  activeMarker?: MarkerFeature;
  activeCluster?: ClusterFeature;
}>();
const { activeMarker, activeCluster } = toRefs(props);

const hasFeatureProps = computed(
  () => activeMarker.value != null || activeCluster.value != null
);

const tableLink = ref<DatasetLocationRoute | undefined>();
</script>
