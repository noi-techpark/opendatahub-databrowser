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
      <IconReload class="size-4" />
      <span class="pl-4">Sync</span>
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { format as formatFn, formatDistanceToNow } from 'date-fns';
import {Size, Variant} from "@/components/button/types.ts";
import ButtonCustom from "@/components/button/ButtonCustom.vue";
import IconReload from "@/components/svg/IconReload.vue";
import { useTableViewStore } from '@/domain/datasets/ui/tableView/tableViewStore';
import { useAuth } from '@/domain/auth/store/auth';

const props = withDefaults(
    defineProps<{
      id: string;
      text: string;
      hasAction?: string;
      date?: string;
      format?: string;
    }>(),
    {
      hasAction: "1",
      date: undefined,
      format: undefined
    }
);
const { date, format } = toRefs(props);
const { openSyncDialog } = useTableViewStore();

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


const doAction = () => {
  openSyncDialog({
    id: props.id,
    title: props.text
  });
}



const auth = useAuth();
const disabled = computed(
  () => !auth.isAuthenticated
);

</script>
