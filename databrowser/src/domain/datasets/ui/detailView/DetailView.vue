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
      <ExportDatasetsAndSettingsToolBox
        :url="fullPath"
        :references-urls="referencesUrls"
      />
      <GoToReferenceAttributeDialog />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import LoadingError from '../../../../components/loading/LoadingError.vue';
import MainAndSubCategories from '../common/MainAndSubCategories.vue';
import { useSingleRecordLoad } from '../common/load/useSingleRecordLoad';
import ExportDatasetsAndSettingsToolBox from '../toolBox/export/ExportDatasetsAndSettingsToolBox.vue';
import GoToReferenceAttributeDialog from '../common/dialogs/goToReferenceAttributeDialog/GoToReferenceAttributeDialog.vue';

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
