<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <LoadingError v-if="isError" :error="error" />
  <template v-else>
    <div class="flex md:overflow-y-auto">
      <MainAndSubCategories
        :data="data"
        :categories="categories"
        :sub-categories="subcategories"
        :current-category="currentCategory"
        :slug="slug"
        :show-edit-hint="false"
        :editable="false"
      />

<!--      <DetailToolBox :url="fullPath" :references-urls="referencesUrls"></DetailToolBox>-->
      <!-- TODO: check this below. it was enabled and now replaced with the above one. understand and implemnts the settings toolbox section -->
      <!-- TODO: check this below. it was enabled and now replaced with the above one. understand and implemnts the settings toolbox section -->
      <!-- TODO: check this below. it was enabled and now replaced with the above one. understand and implemnts the settings toolbox section -->
<!--      <ExportDatasetsAndSettingsToolBox-->
<!--        :url="fullPath"-->
<!--        :references-urls="referencesUrls"-->
<!--      />-->
      <DetailViewToolBox :url="fullPath" :references-urls="referencesUrls" />
      <GoToReferenceAttributeDialog />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import MainAndSubCategories from '../common/MainAndSubCategories.vue';
import GoToReferenceAttributeDialog from '../common/dialogs/goToReferenceAttributeDialog/GoToReferenceAttributeDialog.vue';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import DetailViewToolBox from './toolBox/DetailViewToolBox.vue';
// import DetailToolBox from '@/domain/datasets/ui/detailView/toolBox/DetailToolBox.vue';

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
