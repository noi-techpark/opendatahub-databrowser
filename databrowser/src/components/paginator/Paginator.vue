<!-- eslint-disable vue/multi-word-component-names -->

<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-center">
    <button
      :id="`${id}-previous-page`"
      class="mr-4 rounded"
      :class="[pagination.hasPrevious ? 'text-green-400' : 'text-gray-400']"
      :disabled="!pagination.hasPrevious"
      :data-test="`${id}-previous-page`"
      @click="navigation.goToPage(pagination.currentPage - 1)"
    >
      <IconStrokedArrowDown class="size-5 rotate-90 stroke-current" />
    </button>

    <div class="mr-2 flex items-center">
      <input
        :id="`${id}-page-input`"
        v-model="inputPageValue"
        class="border-r-none h-6 w-12 rounded rounded-r-none border-y border-l px-2 focus:border-green-500"
        :data-test="`${id}-page-input`"
        @keyup.enter="navigation.goToPage(inputPageValue)"
      />
      <ButtonCustom
        :id="`${id}-paginate-to`"
        size="xs"
        class="h-6 w-9 rounded-l-none"
        :data-test="`${id}-paginate-to`"
        @click="navigation.goToPage(inputPageValue)"
      >
        {{ t('datasets.listView.go') }}
      </ButtonCustom>
    </div>
    <span class="mr-4">{{ pageOfManyLabel }}</span>

    <button
      :id="`${id}-next-page`"
      class="mr-2 rounded"
      :class="[pagination.hasNext ? 'text-green-400' : 'text-gray-400']"
      :disabled="!pagination.hasNext"
      :data-test="`${id}-next-page`"
      @click="navigation.goToPage(pagination.currentPage + 1)"
    >
      <IconStrokedArrowDown class="size-5 -rotate-90 stroke-current" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NavigationCallback } from '@/domain/datasets/navigation/types';
import { Pagination } from '@/domain/datasets/pagination/types';
import ButtonCustom from '../button/ButtonCustom.vue';
import IconStrokedArrowDown from '../svg/IconStrokedArrowDown.vue';

const { t } = useI18n();

const props = defineProps<{
  pagination: Pagination;
  navigation: NavigationCallback;
  id: string;
}>();

const inputPageValue = ref(props.pagination.currentPage);

watch(
  () => props.pagination,
  (pagination) => (inputPageValue.value = pagination.currentPage)
);

const pageOfManyLabel = computed(() =>
  props.pagination.pageCount === Infinity
    ? t('datasets.listView.ofUnknown')
    : t('datasets.listView.of', { pageCount: props.pagination.pageCount })
);
</script>
