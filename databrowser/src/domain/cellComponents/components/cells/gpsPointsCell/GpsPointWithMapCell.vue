<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!--
  Detail view cell showing a single GPS point: the values (type, latitude,
  longitude, altitude, SRID) on the left and the map (384px high) on the right. On narrow
  screens the map moves below the values.
-->

<template>
  <div v-if="hasValues" class="flex flex-col gap-4 md:flex-row md:items-start">
    <div class="shrink-0">
      <GpsPointsCell
        :type="type"
        :latitude="latitude"
        :longitude="longitude"
        :altitude="altitude"
        :altitude-unit="altitudeUnit"
      />
      <SubCategoryItem v-if="srid != null" title="SRID" class="w-36">
        <StringCell :text="srid" />
      </SubCategoryItem>
    </div>
    <GpsPointMap
      v-if="hasCoordinates"
      class="h-96 min-w-0 flex-1 overflow-hidden rounded-sm"
      :latitude="latitude"
      :longitude="longitude"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import GpsPointMap from '../editGpsInfoCell/GpsPointMap.vue';
import StringCell from '../stringCell/StringCell.vue';
import GpsPointsCell from './GpsPointsCell.vue';

const props = defineProps<{
  type?: string;
  latitude?: string | number;
  longitude?: string | number;
  altitude?: string | number;
  altitudeUnit?: string;
  srid?: string | number;
}>();

const hasCoordinates = computed(
  () =>
    props.latitude != null &&
    props.latitude !== '' &&
    props.longitude != null &&
    props.longitude !== ''
);

const hasValues = computed(
  () =>
    hasCoordinates.value ||
    props.type != null ||
    props.altitude != null ||
    props.srid != null
);
</script>
