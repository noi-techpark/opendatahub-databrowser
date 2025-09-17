<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="bg-gray-50 text-sm">
    <div class="overflow-x-auto whitespace-nowrap">
      <ContentAlignmentX class="flex items-center">
        <ButtonLink
          variant="ghost"
          size="xs"
          class="mr-2 flex h-6 items-center bg-white px-3 py-1 md:mr-9"
          :to="combinedTableViewPath"
          data-test="table-view-link"
        >
          <IconStrokedArrowDown
            class="-ml-1 mr-1 size-5 rotate-90 stroke-current"
          />
          <span class="line-height-1">
            {{ t('datasets.navigation.tableView') }}
          </span>
        </ButtonLink>

        <TabLink
          v-if="isNewView"
          :label="t('datasets.navigation.newView')"
          :to="newLocation"
          :active="true"
          data-test="new-view-link"
        ></TabLink>
        <TabLink
          v-if="!isNewView && hasDetailView"
          :label="t('datasets.navigation.detailView')"
          :to="{ ...detailLocation, hash }"
          :active="isDetailView || isEditView"
          data-test="detail-view-link"
        />
        <TabLink
          v-if="!isNewView"
          :label="t('datasets.navigation.rawView')"
          :to="rawLocation"
          :active="isRawView"
          data-test="raw-view-link"
        />

        <div class="ml-auto flex items-center space-x-2">
          <DiffChanges v-if="isDiffEditing"></DiffChanges>
          <ButtonsGroup v-if="isDiffEditing && isRawView">
            <ButtonCustom
              :variant="diffEditModeHorizontalVariant"
              @click="setDiffEditMode(DiffEditMode.HORIZONTAL)"
              size="xs"
              class="flex h-6 items-center rounded-none px-3 py-1 first:rounded-l-md last:rounded-r-md"
              :class="{
                'bg-white text-green-500':
                  diffEditMode !== DiffEditMode.HORIZONTAL,
              }"
            >
              <OdhJsonDiffVertical class="size-4" />
            </ButtonCustom>
            <ButtonCustom
              :variant="diffEditModeVerticalVariant"
              @click="setDiffEditMode(DiffEditMode.VERTICAL)"
              size="xs"
              class="flex h-6 items-center rounded-none px-3 py-1 first:rounded-l-md last:rounded-r-md"
              :class="{
                'bg-white text-green-500':
                  diffEditMode !== DiffEditMode.VERTICAL,
              }"
            >
              <OdhJsonDiffHorizontal class="size-4" />
            </ButtonCustom>
          </ButtonsGroup>

          <ButtonCustom
            v-if="isEditView || (isRawView && isRawEditing)"
            :variant="diffEditingVariant"
            @click="toggleDiffEditingMode"
            size="xs"
            class="flex h-6 items-center px-3 py-1"
            :class="{ 'bg-white text-green-500': !isDiffEditing }"
          >
            <OdhJsonDiff class="mr-2 size-3" />
            {{ t('datasets.navigation.actions.diff') }}
          </ButtonCustom>

          <ButtonCustom
            :disabled="!hasEditView || !editRecordSupported"
            :variant="editingVariant"
            :tone="Tone.primary"
            @click="handleEditToggle"
            size="xs"
            class="flex h-6 items-center px-3 py-1"
            :class="{ 'bg-white text-green-500': !isEditing }"
          >
            <IconPencil class="mr-2 size-3" />
            {{ t('datasets.navigation.actions.edit') }}
          </ButtonCustom>
        </div>
      </ContentAlignmentX>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Tone, Variant } from '@/components/button/types';
import ButtonLink from '../../../../components/button/ButtonLink.vue';
import ContentAlignmentX from '../../../../components/content/ContentAlignmentX.vue';
import IconStrokedArrowDown from '../../../../components/svg/IconStrokedArrowDown.vue';
import TabLink from '../../../../components/tab/TabLink.vue';
import { useDatasetLocationStore } from '../../location/store/useDatasetLocationStore';
import { useDatasetPermissionStore } from '../../permission/store/datasetPermissionStore';
import { useDatasetViewStore } from '../../view/store/datasetViewStore';
import { useTableViewRouteQueryStore } from '../tableView/tableViewRouteQueryStore';
import ButtonCustom from '@/components/button/ButtonCustom.vue';
import IconPencil from '@/components/svg/IconPencil.vue';
import OdhJsonDiff from '@/components/svg/odh/OdhJsonDiff.vue';
import DiffChanges from '@/domain/datasets/ui/common/editor/DiffChanges.vue';
import ButtonsGroup from '@/components/button/ButtonsGroup.vue';
import OdhJsonDiffHorizontal from '@/components/svg/odh/OdhJsonDiffHorizontal.vue';
import OdhJsonDiffVertical from '@/components/svg/odh/OdhJsonDiffVertical.vue';
import { DiffEditMode } from '@/domain/datasets/view/types.ts';

const { t } = useI18n();

const datasetViewStore = useDatasetViewStore();
const router = useRouter();
const { currentRoute } = router;

const {
  hasDetailView,
  hasEditView,
  isDetailView,
  isEditView,
  isDiffEditing,
  isRawEditing,
  isNewView,
  diffEditMode,
} = storeToRefs(datasetViewStore);

const isRawView = computed(() => {
  return !isDetailView.value && !isEditView.value && !isNewView.value;
});

const toggleDiffEditingMode = () => {
  datasetViewStore.toggleDiffEditing();
};
const handleEditToggle = () => {
  if(isNewView.value){
    return;
  }

  if (isRawView.value) {
    datasetViewStore.toggleRawEditing();
  } else {
    if (isEditView.value) {
      goToDetailView();
    } else {
      goToEditView();
    }
  }
};
const goToEditView = () => {
  if (hasEditView.value && editRecordSupported.value) {
    router.push({ ...editLocation.value, hash: hash.value });
  }
};
const goToDetailView = () => {
  if (hasDetailView.value) {
    router.push({ ...detailLocation.value, hash: hash.value });
  }
};

const { editRecordSupported } = storeToRefs(useDatasetPermissionStore());

const {
  tableLocation,
  detailLocation,
  editLocation,
  newLocation,
  rawLocation,
} = storeToRefs(useDatasetLocationStore());

const hash = computed(() => currentRoute.value.hash);
const isEditing = computed(() => {
  return isEditView.value || (isRawView.value && isRawEditing.value) || isNewView.value;
});
const editingVariant = computed(() => {
  return isEditing.value ? Variant.solid : Variant.ghost;
});
const diffEditingVariant = computed(() => {
  return isDiffEditing.value ? Variant.soft : Variant.ghost;
});
const diffEditModeHorizontalVariant = computed(() => {
  return diffEditMode.value === DiffEditMode.HORIZONTAL ? Variant.soft : Variant.ghost;
});
const diffEditModeVerticalVariant = computed(() => {
  return diffEditMode.value === DiffEditMode.VERTICAL ? Variant.soft : Variant.ghost;
});
const setDiffEditMode = (mode: DiffEditMode) => {
  datasetViewStore.setDiffEditMode(mode);
};

// Combine query params from TableView with ones from the current route.
// This is needed to keep the query params when switching between DetailView
// and TableView.
const { routeQuery } = useTableViewRouteQueryStore();
const combinedTableViewPath = computed(() => {
  const tableLocationValue = tableLocation?.value ?? {};
  return {
    ...tableLocationValue,
    query: {
      ...routeQuery,
      ...(tableLocationValue.query ?? {}),
    },
  };
});
</script>
