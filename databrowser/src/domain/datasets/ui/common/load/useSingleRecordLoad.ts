// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, toRefs } from 'vue';
import { useDatasetBaseInfoStore } from '../../../config/store/datasetBaseInfoStore';
import { updateDatasetLocationStore } from '../../../location/store/utils';
import { useDatasetViewStore } from '../../../view/store/datasetViewStore';
import { useComputeSingleRecordCategories } from './singleRecordCategories';
import { useComputeSingleRecordCurrentCategory } from './singleRecordCurrentCategories';
import { useComputeSingleRecordSlugWithRouter } from './singleRecordSlug';
import { useSingleRecordSubcategories } from './singleRecordSubcategories';
import { useSingleRecordLoadData } from './useSingleRecordLoadData';

export const useSingleRecordLoad = () => {
  const {
    isLoading: isConfigLoading,
    datasetDomain,
    datasetPath,
    datasetQuery,
    fullPath,
    isGeneratedSource,
    extractValueByPath,
  } = toRefs(useDatasetBaseInfoStore());

  const { view, isNewView, hasEditView } = toRefs(useDatasetViewStore());

  // Load single record data
  const { data, error, isError, isDataLoading, refetch } =
    useSingleRecordLoadData(datasetDomain, fullPath, isNewView);

  updateDatasetLocationStore(datasetDomain, datasetPath, datasetQuery, data);

  // Compute loading state
  const isLoading = computed(
    () => isConfigLoading.value || isDataLoading.value
  );

  // Compute slug and handle slug routing
  const { slug } = useComputeSingleRecordSlugWithRouter(view);

  // Compute categories
  const categories = useComputeSingleRecordCategories(view, isGeneratedSource);

  // Compute current category
  const currentCategory = useComputeSingleRecordCurrentCategory(
    categories,
    slug
  );

  // Compute subcategories with loading support
  const subcategories = useSingleRecordSubcategories(
    isLoading,
    currentCategory
  );

  return {
    data,
    hasEditView,
    isNewView,
    view,
    isError,
    isLoading,
    error,
    fullPath,
    extractValueByPath,
    isGeneratedSource,
    slug,
    categories,
    subcategories,
    currentCategory,
    datasetDomain,
    refetch,
  };
};
