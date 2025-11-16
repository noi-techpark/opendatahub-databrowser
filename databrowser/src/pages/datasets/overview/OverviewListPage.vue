<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <AppLayout>
    <OverviewListPageHero />

    <PageGridContent v-if="!mapVisible" class="grow gap-3 lg:gap-3">
      <div class="flex w-full flex-col items-start gap-2 md:flex-row md:gap-10">
        <!-- Mobile search -->
        <OverviewListSearch
          v-model:search-term="filters.searchVal"
          :updated-filters="updatedFilters"
          class="md:hidden"
          :is-other-datasets-loading="isMetaDataLoading"
          :visible-datasets="visibleDatasets"
        />

        <!-- Mobile map button -->
        <ButtonCustom
          :size="Size.xm2col"
          class="flex items-center justify-center gap-2 uppercase md:hidden"
          @click="showMap()"
        >
          <IconLocationOn />
          {{ t('overview.listPage.showOnMap') }}
        </ButtonCustom>

        <!-- Mobile filters button -->
        <button
          class="flex w-full shrink-0 items-center gap-2 rounded border border-gray-300 px-3 py-2 font-semibold text-green-400 md:hidden"
          @click="showFilters"
        >
          <div class="grow">
            {{ t('overview.listPage.showFilters') }}
          </div>
          <div
            v-if="appliedFiltersNum"
            class="rounded bg-gray-200 px-2 text-sm text-gray-900"
          >
            {{ appliedFiltersNum }}
          </div>
          <IconFilter class="mr-2 size-3" />
        </button>

        <div class="flex flex-col gap-3">
          <!-- Desktop map button -->
          <div
            class="hidden shrink-0 items-center justify-center bg-auto md:flex md:w-64 md:bg-[url('/map-black-white.jpg')]"
          >
            <ButtonCustom
              class="flex items-center justify-center gap-2 uppercase md:my-16"
              :size="Size.xm2col"
              @click="showMap()"
            >
              <IconLocationOn />
              {{ t('overview.listPage.showOnMap') }}
            </ButtonCustom>
          </div>

          <!-- Filters -->
          <div
            class="fixed inset-0 w-full shrink-0 rounded border border-gray-300 bg-white pb-3 md:relative md:block md:w-64"
            :class="{
              hidden: !isFiltersModalVisible,
            }"
          >
            <!-- Title -->
            <div
              class="fixed top-0 z-10 flex w-full items-center gap-1 bg-white md:relative"
            >
              <h3
                class="flex grow items-center gap-2 px-3 py-2 text-2xl font-semibold text-gray-900"
              >
                {{ t('overview.listPage.filter') }}
                <div
                  v-if="appliedFiltersNum"
                  class="rounded bg-gray-200 px-2 text-sm text-gray-900"
                >
                  {{ appliedFiltersNum }}
                </div>
              </h3>

              <ResetAllFilters
                class="mr-3 text-xs"
                @reset-all-filters="resetFilters"
              />
              <button
                class="mr-3 flex size-6 items-center justify-center rounded border border-gray-300 text-green-400 md:hidden"
                @click="hideFilters"
              >
                <IconClose class="size-4" />
              </button>
            </div>

            <!-- Filters list -->
            <div class="h-full overflow-y-auto py-14 md:h-auto md:p-0">
              <button
                class="w-full truncate border-t border-gray-300 px-3 py-2 text-left text-dialog"
                @click="toggleFilter('hasNoMetadata')"
              >
                <ToggleCustomHomePage
                  ref="metadataToggle"
                  v-model="_inputModels.hasNoMetadata"
                  :filter-key="'hasNoMetadata'"
                  :filter-selected="filterSelectedForComponent"
                  class="mr-2"
                />
                {{ t('overview.listPage.noMetadataAvailable') }}
              </button>
              <button
                class="w-full truncate border-t border-gray-300 px-3 py-2 text-left text-dialog"
                @click="toggleFilter('deprecated')"
              >
                <div class="flex items-center gap-2">
                  <div>
                    <ToggleCustomHomePage
                      v-model="_inputModels.deprecated"
                      :filter-key="'deprecated'"
                      :filter-selected="filterSelectedForComponent"
                      class="mr-2"
                    />
                    {{ t('overview.listPage.deprecated') }}
                  </div>
                  <div>
                    <InfoPopover>
                      <PopoverCustomPanel>
                        <PopoverContentHeader class="pb-0">
                          {{
                            t(
                              'datasets.listView.toolBox.deprecatedInfoTooltip.deprecatedInfo.infoPopup.header'
                            )
                          }}
                        </PopoverContentHeader>
                        <PopoverContent
                          class="flex max-w-sm flex-col gap-3 pt-2"
                        >
                          {{
                            t(
                              'datasets.listView.toolBox.deprecatedInfoTooltip.deprecatedInfo.infoPopup.body'
                            )
                          }}
                          <ButtonExternalLink
                            class="flex items-center justify-center p-2"
                            target="_blank"
                            :href="
                              t(
                                'datasets.listView.toolBox.deprecatedInfoTooltip.deprecatedInfo.infoPopup.linkHref'
                              )
                            "
                            :size="Size.xs"
                            :variant="Variant.ghost"
                          >
                            {{
                              t(
                                'datasets.listView.toolBox.deprecatedInfoTooltip.deprecatedInfo.infoPopup.linkText'
                              )
                            }}
                          </ButtonExternalLink>
                        </PopoverContent>
                      </PopoverCustomPanel>
                    </InfoPopover>
                  </div>
                </div>
              </button>
              <Accordion
                v-for="filter in dynamicFilters"
                :key="filter.id"
                :text="filter.name"
                :accordion-id="filter.id"
                :filter-selected="filterSelectedForComponent"
                button-class="font-semibold text-gray-900 pb-2 px-4"
                :badge-value="
                  getActiveFiltersCountOfGroup(
                    filter.id as TourismMetaDataIndexes
                  )
                "
                class="border-t border-gray-300 pt-2 text-dialog"
              >
                <div
                  v-for="option in filter.data"
                  :key="option.key"
                  class="flex items-center border-t border-gray-300 px-4 py-2"
                >
                  <CheckboxCustomHomePage
                    v-model="
                      _inputModels[
                        getInputModelId(
                          filter.id as TourismMetaDataIndexes,
                          option.value
                        )
                      ]
                    "
                    class="mr-2"
                    :filter-key="filter.id?.toLowerCase()"
                    :filter-label="option.key?.toLowerCase()"
                    :label="option.value"
                    :key="option.key"
                    :filter-selected="filterSelectedForComponent"
                    @input="toggleFilter(filter.id, option.key)"
                  />
                  <InfoPopover
                    v-if="filter.id === 'singleDataset'"
                    class="ml-2"
                  >
                    <PopoverCustomPanel>
                      <PopoverContent>
                        {{ getSingleDatasetPopoverDescription(option.key) }}
                      </PopoverContent>
                    </PopoverCustomPanel>
                  </InfoPopover>
                </div>
              </Accordion>
            </div>

            <!-- Action buttons -->
            <div
              class="fixed bottom-0 flex w-full gap-3 border-t border-gray-300 bg-white px-3 py-4 md:relative md:w-auto md:py-3 md:pb-0"
            >
              <ResetAllFilters
                class="flex flex-1 items-center justify-center text-sm"
                @reset-all-filters="resetFilters"
              />
              <button
                class="flex flex-1 cursor-pointer select-none items-center justify-center gap-1 rounded border border-gray-300 bg-green-400 py-1 text-sm text-white md:hidden"
                @click="hideFilters"
              >
                {{ t('overview.listPage.applyFilters') }}
              </button>
            </div>
          </div>
        </div>

        <div class="w-full">
          <OverviewListSearch
            v-model:search-term="filters.searchVal"
            :updated-filters="updatedFilters"
            class="mb-3 hidden md:flex"
            :is-other-datasets-loading="isMetaDataLoading"
            :visible-datasets="visibleDatasets"
          />
          <!-- Results -->
          <div class="flex min-h-screen flex-col gap-4">
            <div v-if="isMetaDataLoading" class="animate-pulse">
              {{ t('overview.listPage.loadOtherDatasets') }}
            </div>
            <template v-else>
              <OverviewCardItem
                v-for="(dataset, index) in visibleDatasets"
                :key="index"
                :dataset="dataset"
                :data-test="`dataset-card-${dataset.id}`"
                class="break-words"
              />
              <div
                v-if="!visibleDatasets.length"
                class="flex items-center justify-center rounded border border-gray-300 p-3"
              >
                {{ t('overview.listPage.noDatasetFoundWithSelectedFilters') }}
              </div>
            </template>
          </div>
        </div>
      </div>

      <CardDivider />

      <PartnersAndContributors />
    </PageGridContent>

    <MapViewAsDialog v-if="mapVisible" @close="hideMap" />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Accordion from '../../../components/accordion/Accordion.vue';
import ButtonCustom from '../../../components/button/ButtonCustom.vue';
import ButtonExternalLink from '../../../components/button/ButtonExternalLink.vue';
import { Size, Variant } from '../../../components/button/types';
import CardDivider from '../../../components/card/CardDivider.vue';
import CheckboxCustomHomePage from '../../../components/checkbox/CheckboxCustomHomePage.vue';
import PageGridContent from '../../../components/content/PageGridContent.vue';
import PartnersAndContributors from '../../../components/partners/PartnersAndContributors.vue';
import InfoPopover from '../../../components/popover/InfoPopover.vue';
import PopoverContent from '../../../components/popover/PopoverContent.vue';
import PopoverContentHeader from '../../../components/popover/PopoverContentHeader.vue';
import PopoverCustomPanel from '../../../components/popover/PopoverCustomPanel.vue';
import IconClose from '../../../components/svg/IconClose.vue';
import IconFilter from '../../../components/svg/IconFilter.vue';
import IconLocationOn from '../../../components/svg/IconLocationOn.vue';
import ToggleCustomHomePage from '../../../components/toggle/ToggleCustomHomePage.vue';
import { embeddedDatasetConfigs } from '../../../config/config';
import {
  getStartedQuery,
  setFilterAndSearchQuery,
} from '../../../domain/contentpage/utils.ts';
import { DatasetConfig } from '../../../domain/datasets/config/types';
import MapViewAsDialog from '../../../domain/datasets/ui/mapView/MapViewAsDialog.vue';
import ResetAllFilters from '../../../domain/datasets/ui/tableView/filter/ResetAllFilters.vue';
import { TourismMetaData } from '../../../domain/metaDataConfig/tourism/types';
import AppLayout from '../../../layouts/AppLayout.vue';
import OverviewCardItem from './OverviewCardItem.vue';
import OverviewListPageHero from './OverviewListPageHero.vue';
import OverviewListSearch from './OverviewListSearch.vue';
import { useMetaDataForAllDatasets } from './useDatasets';

const { t } = useI18n();

const router = useRouter();

const showMap = () =>
  router.push({ query: { ...router.currentRoute.value.query, map: 'true' } });

const hideMap = () =>
  router.push({
    query: { ...router.currentRoute.value.query, map: undefined },
  });

const mapVisible = computed(
  () => router.currentRoute.value.query.map === 'true'
);

type TourismMetaDataIndexes =
  | 'dataSpace'
  | 'categories'
  | 'tags'
  | 'datasetConfigurations'
  | 'access'
  | 'sources'
  | 'dataProviders'
  | 'singleDataset';

interface Filters {
  searchVal: string;
  applied: Record<string, FilterObject>;
}

interface FilterObject {
  key: string;
  value?: string;
}

interface FilterSelectItem {
  key: string;
  value: string;
}

interface DynamicFilter {
  id: string;
  name: string;
  data: FilterSelectItem[];
}

const defaultFilters = {
  searchVal: '',
  applied: {} as Record<string, FilterObject>,
};
const _inputModels = ref<Record<string, boolean>>({
  hasNoMetadata: false,
  deprecated: false,
});

const isFiltersModalVisible = ref(false);
const filters = ref(structuredClone(defaultFilters) as Filters);

// Methods
const setInputModelKeyValue = (
  key: TourismMetaDataIndexes,
  propName: string
) => {
  // NOTE: defining the object key here it's necessary to properly reset the object programmatically with the reset button. Using the filters array to handle component's v-model will lead into too much code complexity.
  _inputModels.value[getInputModelId(key as TourismMetaDataIndexes, propName)] =
    false;
};

const mapDatasetsKeyArrayToFilterItems = (
  datasets: TourismMetaData[],
  key: TourismMetaDataIndexes
) => {
  const addedProps: Record<string, boolean> = {};
  const finalList: FilterSelectItem[] = [];

  datasets.forEach((dataset) => {
    if (dataset[key] != null) {
      (dataset[key] as string[]).forEach((propName) => {
        if (addedProps[propName] !== true) {
          addedProps[propName] = true;
          finalList.push(getFilterSectionItemObject(propName, propName));
          setInputModelKeyValue(key, propName);
        }
      });
    }
  });

  return finalList;
};

const mapDatasetsKeyStringToFilterItems = (
  datasets: TourismMetaData[],
  key: TourismMetaDataIndexes
) => {
  const addedProps = {} as Record<string, boolean>;
  const finalList: FilterSelectItem[] = [];

  datasets.forEach((dataset) => {
    const propName = dataset[key] as string;
    if (propName) {
      if (!addedProps[propName]) {
        addedProps[propName] = true;
        finalList.push(getFilterSectionItemObject(propName, propName));
        setInputModelKeyValue(key, propName);
      }
    }
  });

  return finalList;
};

const showFilters = () => {
  isFiltersModalVisible.value = true;
};

const hideFilters = () => {
  isFiltersModalVisible.value = false;
};

const filterSelectedForComponent = ref<{ key: string; value: string }[]>([]);

const initializeFiltersAndSearch = () => {
  const { filterQuery, searchQuery } = getStartedQuery();
  if (
    !searchQuery &&
    searchQuery !== '' &&
    !filterQuery &&
    filterQuery.length === 0
  ) {
    return;
  }
  if (searchQuery) {
    filters.value.searchVal = searchQuery;
    if (!filterQuery && filterQuery.length === 0)
      setFilterAndSearchQuery(router, [], searchQuery);
  }
  if (filterQuery && filterQuery.length > 0) {
    filterSelectedForComponent.value = decodeURIComponent(filterQuery)
      .split('&')
      .map((filter) => {
        const [key, ...valueParts] = filter.split('-');
        const value =
          key === 'hasNoMetadata' || key === 'deprecated'
            ? ''
            : valueParts.join('-');
        toggleFilter(key, value);
        return { key, value };
      });
  }
};

onBeforeMount(() => {
  return initializeFiltersAndSearch();
});

const resetFilters = () => {
  setFilterAndSearchQuery(router, [], '');

  filters.value = structuredClone(defaultFilters);
  filterSelectedForComponent.value = [];

  for (const [key] of Object.entries(_inputModels.value)) {
    _inputModels.value[key] = false;
  }
  hideFilters();
};

const isFilterEnabled = (key: string, value?: string) => {
  const filterFullKey = getFilterFullKey(key, value);
  return filters.value.applied[filterFullKey] !== undefined;
};

const updatedFilters = ref<string[]>([]);

const createStringFilter = (key: string, value?: string) => {
  return key === 'hasNoMetadata' || key === 'deprecated'
    ? `${key}-true`
    : `${key}-${value}`;
};

const getParams = (): string[] => {
  const query = router.currentRoute.value.query;
  const filterQuery = query['filterQuery'] ? query['filterQuery'] : [];

  return typeof filterQuery === 'string' ? filterQuery.split('&') : [];
};

const toggleFilter = (key: string, value?: string) => {
  const filterString = createStringFilter(key, value);
  const currentFilters: string[] = getParams();
  if (isFilterEnabled(key, value)) {
    if (currentFilters.includes(filterString)) {
      updatedFilters.value = currentFilters.filter(
        (filter) => filter !== filterString
      );
    }
    unsetFilter(key, value);
  } else {
    updatedFilters.value = [...currentFilters, filterString].filter(
      (filter, index, self) => self.findIndex((f) => f === filter) === index
    );

    setFilter(key, value);
  }

  setFilterAndSearchQuery(
    router,
    updatedFilters.value,
    filters.value.searchVal
  );
};

const setFilter = (key: string, value?: string) => {
  const filterFullKey = getFilterFullKey(key, value);
  filters.value.applied[filterFullKey] = getFilterObject(key, value);
  if (isModelAffectedFilter(key)) {
    _inputModels.value[key] = true;
  }
};

const unsetFilter = (key: string, value?: string) => {
  const filterFullKey = getFilterFullKey(key, value);
  delete filters.value.applied[filterFullKey];
  if (isModelAffectedFilter(key)) {
    _inputModels.value[key] = false;
  }
};

const isModelAffectedFilter = (key: string) => {
  return key == 'hasNoMetadata' || key == 'deprecated';
};

const getFilterFullKey = (key: string, value?: string) => {
  return key + (value ? '-' + value : '');
};

const getFilterObject = (key: string, value?: string): FilterObject => {
  return {
    key,
    value,
  };
};

const getInputModelId = (matchType: TourismMetaDataIndexes, match: string) => {
  return matchType + '-' + match;
};

const getDynamicFilterObject = (
  id: string,
  name: string,
  data: FilterSelectItem[]
): DynamicFilter => {
  return {
    id,
    name,
    data,
  };
};

const getFilterSectionItemObject = (
  key: string,
  value: string
): FilterSelectItem => {
  return {
    key,
    value,
  };
};

const getActiveFiltersCountOfGroup = (groupId: TourismMetaDataIndexes) => {
  let count = 0;

  for (const [filterId] of Object.entries(filters.value.applied)) {
    if (filterId.startsWith(groupId + '-')) {
      count++;
    }
  }

  return count;
};

const getSingleDatasetPopoverDescription = (forOption: string) => {
  switch (forOption) {
    case 'aggregated':
      return t('overview.listPage.aggregatedDatasetDesc');

    case 'single':
      return t('overview.listPage.singleDatasetDesc');

    default:
      return 'Unknown option';
  }
};

// Computed
const allDatasetConfigs = computed(() => {
  const list: DatasetConfig[] = [];

  for (const datasets of Object.values(embeddedDatasetConfigs)) {
    for (const dataset of Object.values(datasets)) {
      list.push(dataset);
    }
  }

  return list;
});

const dynamicFilters = computed(
  () =>
    [
      getDynamicFilterObject(
        'dataSpace',
        t('overview.listPage.dataSpace'),
        availableDataSpaces.value
      ),
      getDynamicFilterObject(
        'categories',
        t('overview.listPage.categories'),
        availableCategories.value
      ),
      getDynamicFilterObject(
        'tags',
        t('overview.listPage.tags'),
        availableTags.value
      ),
      getDynamicFilterObject(
        'datasetConfigurations',
        t('overview.listPage.datasetConfigurations'),
        availableDatasetConfigurations.value
      ),
      getDynamicFilterObject(
        'access',
        t('overview.listPage.accessType'),
        availableAccessTypes.value
      ),
      getDynamicFilterObject(
        'dataProviders',
        t('overview.listPage.dataProvider'),
        availableDataProviders.value
      ),
      getDynamicFilterObject(
        'sources',
        t('overview.listPage.source'),
        availableSources.value
      ),
      getDynamicFilterObject(
        'singleDataset',
        t('overview.listPage.dataset'),
        availableDatasetFilters.value
      ),
    ] as DynamicFilter[]
);

const { metaData, isMetaDataLoading } = useMetaDataForAllDatasets();

const visibleDatasets = computed(() => {
  let datasets = [...metaData.value];

  if (filters.value.searchVal) {
    const searchTerm = filters.value.searchVal.toLowerCase(); // Pre-calculate lowercase search term
    datasets = datasets.filter(
      (dataset) =>
        // Check if shortname includes the search term
        dataset.shortname.toLowerCase().includes(searchTerm) ||
        // Check if description exists AND includes the search term
        (dataset.description &&
          dataset.description.toLowerCase().includes(searchTerm))
    );
  }

  // Group filters by key
  const filterGroups: Record<string, (string | boolean)[]> = {};
  for (const filter of Object.values(filters.value.applied)) {
    const key = filter.key;
    if (filterGroups[key] === undefined) {
      filterGroups[key] = [];
    }
    filterGroups[key].push(filter.value || true);
  }

  for (const [key, acceptedValues] of Object.entries(filterGroups)) {
    const parsedAcceptedValues = acceptedValues.map((value) => {
      if (value === 'true' || value === 'false') {
        return JSON.parse(value);
      }
      return value;
    });

    switch (key) {
      case 'hasNoMetadata':
      case 'deprecated':
      case 'dataSpace':
      case 'access':
        datasets = datasets.filter((dataset) =>
          parsedAcceptedValues.includes(
            dataset[key as TourismMetaDataIndexes] as string | boolean
          )
        );
        break;

      case 'tags':
      case 'categories':
      case 'sources':
      case 'dataProviders':
        datasets = datasets.filter((dataset) => {
          const filtrableValues = dataset[
            key as TourismMetaDataIndexes
          ]! as string[];
          if (filtrableValues?.length) {
            return filtrableValues.find((value) =>
              parsedAcceptedValues.includes(value)
            );
          }
        });
        break;

      case 'singleDataset':
        if (
          !parsedAcceptedValues.includes('aggregated') ||
          !parsedAcceptedValues.includes('single')
        ) {
          datasets = datasets.filter((dataset) => {
            let matchPref = true;
            if (parsedAcceptedValues.includes('aggregated')) {
              matchPref = false;
            }
            return (
              (dataset[key as TourismMetaDataIndexes]! as boolean) === matchPref
            );
          });
        }
        break;

      case 'datasetConfigurations':
        if (
          !parsedAcceptedValues.includes('with') ||
          !parsedAcceptedValues.includes('without')
        ) {
          datasets = datasets.filter((dataset) => {
            const datasetPath = dataset.pathSegments.join('/');
            if (!datasetPath) {
              return false;
            }

            const hasConfig =
              allDatasetConfigs.value.find(
                (dataset) =>
                  dataset.route.pathSegments.join('/') === datasetPath
              ) !== undefined;
            return parsedAcceptedValues.includes('with')
              ? hasConfig
              : !hasConfig;
          });
        }
        break;
    }
  }

  return datasets;
});

const availableDataSpaces = computed(() => {
  return mapDatasetsKeyStringToFilterItems(metaData.value, 'dataSpace');
});

const availableCategories = computed(() => {
  return mapDatasetsKeyArrayToFilterItems(metaData.value, 'categories');
});

const availableDataProviders = computed(() => {
  return mapDatasetsKeyArrayToFilterItems(metaData.value, 'dataProviders');
});

const availableSources = computed(() => {
  return mapDatasetsKeyArrayToFilterItems(metaData.value, 'sources');
});

const availableTags = computed(() => {
  return mapDatasetsKeyArrayToFilterItems(metaData.value, 'tags');
});

const availableAccessTypes = computed(() => {
  return mapDatasetsKeyStringToFilterItems(metaData.value, 'access');
});

const availableDatasetFilters = computed(() => {
  const filters = [
    getFilterSectionItemObject('aggregated', t('overview.listPage.aggregated')),
    getFilterSectionItemObject('single', t('overview.listPage.single')),
  ];

  filters.forEach((filter) => {
    setInputModelKeyValue('singleDataset', filter.value);
  });

  return filters;
});

const availableDatasetConfigurations = computed(() => {
  const filters = [
    getFilterSectionItemObject(
      'with',
      t('overview.listPage.withConfiguration')
    ),
    getFilterSectionItemObject(
      'without',
      t('overview.listPage.withoutConfiguration')
    ),
  ];

  filters.forEach((filter) => {
    setInputModelKeyValue('datasetConfigurations', filter.value);
  });

  return filters;
});

const appliedFiltersNum = computed(() => {
  return Object.keys(filters.value.applied).length;
});
</script>
