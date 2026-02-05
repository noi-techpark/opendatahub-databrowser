<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-wrap gap-3 lg:flex-nowrap">
    <div class="flex basis-full flex-col gap-3 lg:basis-1/3">
      <SubCategoryItem :title="t('datasets.editView.map.geoDataType')">
        <SelectWithOptionsCell
          id="select-gps-type"
          :value="position.Type"
          :options="gpsTypeOptions"
          show-add-new-value
          :editable="editable"
          class="w-full"
          @update="onUpdateGpsType($event.value)"
          @add-new-value="onAddNewValueInSelect"
        />
      </SubCategoryItem>

      <SubCategoryItem :title="t('datasets.editView.map.wkt')">
        <StringCell
          :text="position.Geometry"
          :editable="editable"
          @input="onUpdateInputPositionValue('Geometry', $event.target.value)"
        />
      </SubCategoryItem>

      <SubCategoryItem :title="t('datasets.editView.map.default')">
        <ToggleCell
          :text="position.Geometry"
          :editable="editable"
          :enabled="position.Default"
          @update="onUpdateDefaultValue($event.value)"
        />
      </SubCategoryItem>

      <SubCategoryItem :title="t('datasets.editView.map.latitude')">
        <StringCell
          :text="position.Latitude"
          readonly
          @input="onUpdateInputPositionValue('Latitude', $event.target.value)"
        />
      </SubCategoryItem>
      <SubCategoryItem :title="t('datasets.editView.map.longitude')">
        <StringCell
          :text="position.Longitude"
          readonly
          @input="onUpdateInputPositionValue('Longitude', $event.target.value)"
        />
      </SubCategoryItem>
      <SubCategoryItem :title="t('datasets.editView.map.altitude')">
        <StringCell
          :text="position.Altitude"
          :editable="editable"
          @input="onUpdateInputPositionValue('Altitude', $event.target.value)"
        />
      </SubCategoryItem>
    </div>

    <div class="z-0 basis-full lg:basis-2/3">
      <EditGeoDataOverview
        :title="t('datasets.editView.map.mapPreviewDataInserted')"
        content-has-no-padding
        :editable="editable"
        :is-editing="enableSetMarker"
        @edit="geoDataMap?.toggleEditMode()"
        @expand="geoDataMap?.toggleFullscreen()"
      >
        <template #content>
          <GeoDataMap
            ref="geoDataMap"
            class="h-60"
            :wkt="position.Geometry"
            :fallback-center="fallbackMapCenter"
            :editable="editable"
            @update:wkt="onWktUpdate"
            @enable-set-marker="onEnableSetMarker"
          />
        </template>
      </EditGeoDataOverview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapDefaultCoordinates } from '../../../../../components/map/consts';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import StringCell from '../stringCell/StringCell.vue';
import EditGeoDataOverview from './EditGeoDataOverview.vue';
import GeoDataMap from './GeoDataMap.vue';
import { useEditGeoDataCellStore } from './editGeoDataCellStore';
import { GeoDataEntry } from './types';
import { parseWKT } from '../../../../../components/map/utils/wktParser';
import ToggleCell from '../toggleCell/ToggleCell.vue';

const { editable } = useInjectEditMode();

const { t } = useI18n();

const emit = defineEmits(['newPosition']);

const editGeoDataCellStore = useEditGeoDataCellStore();

const geoDataMap = ref<InstanceType<typeof GeoDataMap> | null>(null);
const enableSetMarker = ref(false);

type GeoDataEntryKey = keyof GeoDataEntry;

const props = defineProps<{
  data: GeoDataEntry;
}>();

const { data: position } = toRefs(props);

const gpsTypeOptions = computed(() => {
  return editGeoDataCellStore.sortedPositionOptions;
});

const fallbackMapCenter = computed(() => mapDefaultCoordinates);

const setLastSavedType = () => {
  const fetchedOptions = editGeoDataCellStore.positionOptions;

  if (
    !position.value.Type ||
    fetchedOptions.map((item) => item.value).includes(position.value.Type)
  ) {
    return;
  }

  editGeoDataCellStore.setPositionOptions([
    ...fetchedOptions,
    { label: position.value.Type, value: position.value.Type },
  ]);
};

const onAddNewValueInSelect = (value: boolean) => {
  if (value) return;

  setLastSavedType();
};

const onUpdateGpsType = (value: string) => {
  onUpdatePosition({ ...position.value, Type: value });
};

const onUpdateDefaultValue = (value: boolean) => {
  onUpdatePosition({ ...position.value, Default: value });
};

const onUpdateInputPositionValue = (key: GeoDataEntryKey, value: string) => {
  onUpdatePosition({ ...position.value, [key]: value });
};

const onWktUpdate = (wkt: string) => {
  // Extract coordinates from WKT if it's a Point
  let latitude = undefined;
  let longitude = undefined;

  if (wkt) {
    try {
      const geometry = parseWKT(wkt);
      if (geometry.type === 'Point') {
        const coords = geometry.coordinates as [number, number];
        longitude = coords[0];
        latitude = coords[1];
      }
    } catch (error) {
      console.error('Error parsing WKT:', error);
    }
  }

  onUpdatePosition({
    ...position.value,
    Geometry: wkt,
    Latitude: latitude,
    Longitude: longitude,
  });
};

const onEnableSetMarker = (value: boolean) => {
  enableSetMarker.value = value;
};

const onUpdatePosition = (value: GeoDataEntry) => {
  emit('newPosition', value);
};
</script>
