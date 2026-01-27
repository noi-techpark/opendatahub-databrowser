<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <LoadingError v-if="isError" :error="error" />
  <template v-else>
    <div class="flex h-full md:overflow-y-auto">
      <MainAndSubCategories
        :data="data"
        :categories="categories"
        :sub-categories="subcategories"
        :current-category="currentCategory"
        :slug="slug"
        :show-edit-hint="false"
        :editable="false"
      />

      <DetailViewToolBox :url="fullPath" :references-urls="referencesUrls"></DetailViewToolBox>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import MainAndSubCategories from '../common/MainAndSubCategories.vue';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import DetailViewToolBox from '@/domain/datasets/ui/detailView/toolBox/DetailViewToolBox.vue';

const {
  isError,
  data,
  error,
  fullPath,
  slug,
  categories,
  subcategories,
  currentCategory,
} = useSingleRecordLoad();

const referencesUrls = computed(() => {
  const takenUrls = new Set<string>();

  return categories.value
    ? categories.value.flatMap((category) =>
        category.subCategories.flatMap((subCategory) => {
          const results = [];
          for (const property of subCategory.properties) {
            const referenceInfo = property.referenceInfo;
            if (
              referenceInfo &&
              referenceInfo.url &&
              !takenUrls.has(referenceInfo.url)
            ) {
              takenUrls.add(referenceInfo.url);
              results.push({
                from: referenceInfo.from || referenceInfo.url,
                url: referenceInfo.url,
              });
            }
          }
          return results;
        })
      )
    : [];
});
</script>
