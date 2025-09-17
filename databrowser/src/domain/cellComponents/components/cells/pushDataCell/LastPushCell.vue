<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="date != null">
    <span class="block">{{ formattedDistance }}</span>
    <span class="block text-gray-600">{{ formattedDate }}</span>

    <ButtonCustom
      :disabled="disabled"
      class="flex items-center py-1 px-2 text-green-500 mt-3 text-sm"
      :size="Size.xs"
      :variant="Variant.ghost"
      @click="doAction"
    >
      <IconPush class="size-4" />
      <span class="pl-4">Push</span>
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { format as formatFn, formatDistanceToNow } from 'date-fns';
import {Size, Variant} from "@/components/button/types.ts";
import ButtonCustom from "@/components/button/ButtonCustom.vue";
import IconPush from "@/components/svg/IconPush.vue";
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { storeToRefs } from 'pinia';
import { usePublisherStore } from '@/domain/publisher/publisherStore';
import { Publisher } from './types';
import { useAuth } from '@/domain/auth/store/auth';

const props = withDefaults(
    defineProps<{
      id?: string;
      type?: string;
      publishedOn?: string[];
      hasAction?: string;
      date?: string;
      title?: string;
      format?: string;
    }>(),
    {
      title: '',
      hasAction: "1",
      date: undefined,
      format: undefined
    }
);
const { date, format } = toRefs(props);
const { openPushDialog } = useTableViewStore();


const formattedDate = computed(() => {
  if (format.value == null) {
    return date;
  }
  if (date.value != null) {
    return formatFn(Date.parse(date.value), format.value);
  }
  return '';
});
const formattedDistance = computed(() => {
  if (date.value != null) {
    return formatDistanceToNow(Date.parse(date.value), {
      addSuffix: true,
      includeSeconds: true,
    });
  }
  return '';
});

const { publishers } = storeToRefs(usePublisherStore());

// Compute the publishers with the URL to push data to
const publishersWithUrl = computed(() => {
  if (props.publishedOn == null || props.publishedOn.length === 0) {
    return [];
  }

  return (
    publishers.value
      // Use only publishers that are in the publishedOn list
      .filter(
        (publisher) =>
          props.publishedOn?.find((pon) => pon === publisher.id) != null
      )
      .map<Publisher>((publisher) => ({
        id: publisher.id,
        name: publisher.name,
        url: publisher.buildUrl(props.id, props.type),
      }))
  );
});


const doAction = () => {
  console.log('Push action triggered');
  openPushDialog({
    id: props.id,
    title: props.title ?? '',
    publishers: publishersWithUrl.value
  });
}


const auth = useAuth();
const disabled = computed(
  () => !auth.isAuthenticated || publishers.value.length === 0
);

</script>
