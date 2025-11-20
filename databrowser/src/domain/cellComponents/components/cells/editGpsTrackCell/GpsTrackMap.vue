<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <UseFullscreen ref="fullscreenComponent" v-slot="{ toggle, isFullscreen }">
    <div
      class="relative size-full bg-gray-50"
      :class="{
        'group flex cursor-pointer items-center justify-center bg-black/60':
          !isFullscreen && preventInteraction,
      }"
      @click="onContainerClick(isFullscreen)"
    >
      <IconExpanded
        v-if="preventInteraction && !isFullscreen"
        class="absolute text-white transition-all group-hover:scale-125"
      />

      <div
        v-if="isFullscreen"
        class="absolute right-4 top-4 z-[999] flex items-center gap-3"
      >
        <ButtonCustom
          variant="ghost"
          size="xs"
          class="flex size-12 items-center justify-center bg-white p-2"
          @click="toggle()"
        >
          <IconClose class="cursor-pointer text-green-400" />
        </ButtonCustom>
      </div>

      <div
        v-if="isLoading"
        class="flex h-full items-center justify-center"
        :class="{ 'opacity-50': !isFullscreen && preventInteraction }"
      >
        <IconCycle class="animate-spin text-dialog" />
      </div>
      <div
        v-else-if="error"
        class="flex h-full items-center justify-center p-4 text-center text-sm text-red-500"
        :class="{ 'opacity-50': !isFullscreen && preventInteraction }"
      >
        Could not load track data from the provided URL: {{ error.message || error }}
      </div>
      <div
        v-else-if="!trackData"
        class="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500"
        :class="{ 'opacity-50': !isFullscreen && preventInteraction }"
      >
        No valid track data found.
      </div>
      <GeoTrackMap
        v-else
        :key="`map_${isFullscreen}`"
        :track-data="trackData"
        :hide-attribution="!isFullscreen"
        :class="{
          'pointer-events-none opacity-50': !isFullscreen && preventInteraction,
        }"
      />
    </div>
  </UseFullscreen>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { useQuery } from '@tanstack/vue-query';
import UseFullscreen from '../../../../../components/fullscreen/UseFullscreen.vue';
import IconCycle from '../../../../../components/svg/IconCycle.vue';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import GeoTrackMap from '../../../../../components/map/geoTrackMap/GeoTrackMap.vue';

const props = withDefaults(
  defineProps<{
    trackUrl: string;
    preventInteraction?: boolean;
    fullscreenOnClick?: boolean;
  }>(),
  {
    preventInteraction: false,
    fullscreenOnClick: false,
  }
);

// Fetch track data
const fetchTrackData = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      responseType: 'text',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching track data:', error);
    throw error;
  }
};

// Vue Query for data fetching with caching
const {
  data: trackData,
  isLoading,
  error,
} = useQuery({
  queryKey: ['trackData', props.trackUrl],
  queryFn: () => fetchTrackData(props.trackUrl),
  enabled: computed(() => !!props.trackUrl),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
});

const fullscreenComponent = ref();

const toggleFullscreen = () => {
  fullscreenComponent.value.toggleFullscreen();
};

const onContainerClick = (isFullscreen: boolean) => {
  if (isFullscreen || !props.fullscreenOnClick) {
    return;
  }
  toggleFullscreen();
};

defineExpose({ toggleFullscreen });
</script>
