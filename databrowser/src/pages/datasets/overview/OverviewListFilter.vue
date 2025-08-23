<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <!-- Title -->
    <div
      class="fixed top-0 z-10 flex w-full items-center gap-1 bg-white md:relative"
    >
      <h3
        class="flex grow items-center gap-2 px-3 py-2 text-2xl font-semibold text-gray-900"
      >
        {{ t('overview.listPage.filter') }}
        <div
          v-if="appliedFiltersNum > 0"
          class="rounded bg-gray-200 px-2 text-sm text-gray-900"
        >
          {{ appliedFiltersNum }}
        </div>
      </h3>

      <ResetAllFilters
        class="mr-3 text-xs"
        @reset-all-filters="resetAllFilters"
      />
    </div>

    <!-- Filter list -->
    <div class="h-full overflow-y-auto py-14 md:h-auto md:p-0">
      <div
        class="w-full cursor-pointer truncate border-t border-gray-300 px-3 py-2 text-left text-dialog"
        @click="toggleFilter('hasNoMetadata')"
      >
        <ToggleCustom
          ref="metadataToggle"
          class="mr-2"
          :model-value="filters.has('hasNoMetadata')"
        />
        {{ t('overview.listPage.noMetadataAvailable') }}
      </div>
      <div
        class="w-full truncate border-t border-gray-300 px-3 py-2 text-left text-dialog"
      >
        <div
          class="flex cursor-pointer items-center gap-2"
          @click="toggleFilter('deprecated')"
        >
          <div>
            <ToggleCustom
              class="mr-2"
              :model-value="filters.has('deprecated')"
            />
            {{ t('overview.listPage.deprecated.name') }}
          </div>
          <InfoPopover>
            <PopoverCustomPanel>
              <PopoverContentHeader class="pb-0">
                {{ t('overview.listPage.deprecated.infoPopup.header') }}
              </PopoverContentHeader>
              <PopoverContent class="flex max-w-sm flex-col gap-3 pt-2">
                {{ t('overview.listPage.deprecated.infoPopup.body') }}
                <ButtonExternalLink
                  class="flex items-center justify-center p-2"
                  target="_blank"
                  :href="t('overview.listPage.deprecated.infoPopup.linkHref')"
                  :size="Size.xs"
                  :variant="Variant.ghost"
                >
                  {{ t('overview.listPage.deprecated.infoPopup.linkText') }}
                </ButtonExternalLink>
              </PopoverContent>
            </PopoverCustomPanel>
          </InfoPopover>
        </div>
      </div>

      <Accordion
        v-for="availableFilter in availableFilters"
        :key="availableFilter.key"
        :text="availableFilter.name"
        :accordion-id="availableFilter.key"
        :badge-value="activeFilterCountForKey(availableFilter.key)"
        button-class="font-semibold text-gray-900 pb-2 px-4"
        class="border-t border-gray-300 pt-2 text-dialog"
      >
        <div
          v-for="option in availableFilter.options"
          :key="option.key"
          class="flex items-center border-t border-gray-300 px-4 py-2"
        >
          <CheckboxCustom
            :model-value="filters.has(`${availableFilter.key}-${option.key}`)"
            :label="option.value"
            class="mr-2 capitalize"
            @update:model-value="
              toggleFilter(`${availableFilter.key}-${option.key}`)
            "
          />

          <!-- Dataset option has additional info -->
          <InfoPopover v-if="availableFilter.key === 'singleDataset'">
            <PopoverCustomPanel>
              <PopoverContent>
                <template v-if="option.key === 'aggregated'">
                  {{ t('overview.listPage.aggregatedDatasetDesc') }}
                </template>
                <template v-if="option.key === 'single'">
                  {{ t('overview.listPage.singleDatasetDesc') }}
                </template>
              </PopoverContent>
            </PopoverCustomPanel>
          </InfoPopover>
        </div>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Accordion from '../../../components/accordion/Accordion.vue';
import ButtonExternalLink from '../../../components/button/ButtonExternalLink.vue';
import { Size, Variant } from '../../../components/button/types';
import CheckboxCustom from '../../../components/checkbox/CheckboxCustom.vue';
import InfoPopover from '../../../components/popover/InfoPopover.vue';
import PopoverContent from '../../../components/popover/PopoverContent.vue';
import PopoverContentHeader from '../../../components/popover/PopoverContentHeader.vue';
import PopoverCustomPanel from '../../../components/popover/PopoverCustomPanel.vue';
import ToggleCustom from '../../../components/toggle/ToggleCustom.vue';
import ResetAllFilters from '../../../domain/datasets/ui/tableView/filter/ResetAllFilters.vue';
import { useOverviewListStore } from './overviewListStore';

const { t } = useI18n();

const { filters, availableFilters } = storeToRefs(useOverviewListStore());

const { resetAllFilters, toggleFilter } = useOverviewListStore();

const appliedFiltersNum = computed(() => {
  return filters.value.size;
});

const activeFilterCountForKey = (filterKey: string) => {
  return Array.from(filters.value).filter((f) => f.startsWith(filterKey))
    .length;
};
</script>
