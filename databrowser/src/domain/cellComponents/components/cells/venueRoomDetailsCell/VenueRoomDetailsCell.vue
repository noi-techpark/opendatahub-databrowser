<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TagReferenceCell
    :items="props.items"
    :url="venueRoomUrl"
    key-selector="RoomDetails\.[0]\.Id"
    label-selector="RoomDetails\.[0]\.Detail.{language}.Title"
    :unique="props.unique"
    :editable="props.editable"
    @update="$emit('update', $event)"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { withOdhBaseUrl } from '../../../../../config/utils';
import { useEditStore } from '../../../../datasets/ui/editView/store/editStore';
import TagReferenceCell from '../tagReferenceCell/TagReferenceCell.vue';

const props = withDefaults(
  defineProps<{
    items?: string[] | null;
    unique?: boolean | string;
    editable?: boolean;
  }>(),
  {
    items: () => [],
    unique: true,
    editable: true,
  }
);

const emit = defineEmits<{
  update: [value: { prop: string; value: unknown }];
}>();

const editStore = useEditStore();

const venueIds = computed(() => {
  const ids = (editStore.current as Record<string, unknown>)?.VenueIds;
  return Array.isArray(ids) ? (ids as string[]) : [];
});

const venueRoomUrl = computed(() => {
  const idFilter =
    venueIds.value.length > 0 ? `&idfilter=${venueIds.value.join(',')}` : '';
  return withOdhBaseUrl(
    `/v1/Venue?denormalize=true&fields=RoomDetails.[0].Id,RoomDetails.[0].Detail&pagesize=0${idFilter}`
  );
});

// Clear selected rooms whenever the venue selection changes
watch(
  () => venueIds.value.join(','),
  () => {
    if (props.editable) {
      emit('update', { prop: 'items', value: [] });
    }
  }
);
</script>
