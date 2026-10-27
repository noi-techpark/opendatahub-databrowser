<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <CardContainer no-padding>
    <CardLinkContainer :to="tableLocation">
      <CardTitle tag-name="h2" class="text-green-400">
        <div class="flex items-center gap-3 no-underline">
          <DatasetTitle :dataset="dataset" />
          <ArrowLine />
        </div>
        <template #right>
          <div class="flex gap-3 md:justify-self-end">
            <TagCustom
              class="capitalize"
              size="xs"
              type="black"
              :text="dataset.dataSpace ?? t('overview.info.dataSpace.unknown')"
            />
            <OverviewTagAccess :dataset="dataset" />
          </div>
        </template>
      </CardTitle>
      <CardText class="mb-4">
        {{ getDisplayDescription(dataset) }}
      </CardText>
      <OverviewInfoSources :dataset="dataset" />
      <CardDivider no-bottom />
    </CardLinkContainer>
    <div class="px-3 pb-5 lg:px-5">
      <DeprecationNotice :dataset="dataset" class="mb-4" />
      <CardActions>
        <OverviewLinkInfo :dataset="dataset" />
        <OverviewLinkApi :dataset="dataset" />
      </CardActions>
    </div>
  </CardContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CardActions from '../../../components/card/CardActions.vue';
import CardContainer from '../../../components/card/CardContainer.vue';
import CardDivider from '../../../components/card/CardDivider.vue';
import CardText from '../../../components/card/CardText.vue';
import CardTitle from '../../../components/card/CardTitle.vue';
import ArrowLine from '../../../components/svg/ArrowLine.vue';
import TagCustom from '../../../components/tag/TagCustom.vue';
import DatasetTitle from '../../../domain/datasets/ui/common/DatasetTitle.vue';
import DeprecationNotice from '../../../domain/datasets/ui/common/DeprecationNotice.vue';
import { getDisplayDescription } from '../../../domain/datasets/ui/common/datasetReplacements';
import { TourismMetaData } from '../../../domain/metaDataConfig/tourism/types';
import OverviewInfoSources from './OverviewInfoSources.vue';
import OverviewLinkApi from './OverviewLinkApi.vue';
import OverviewLinkInfo from './OverviewLinkInfo.vue';
import OverviewTagAccess from './OverviewTagAccess.vue';
import { getTableLocationFromDataset } from '../../../domain/datasets/utils';
import { computed, toRefs } from 'vue';
import CardLinkContainer from '../../../components/card/CardLinkContainer.vue';

const props = defineProps<{ dataset: TourismMetaData }>();
const { dataset } = toRefs(props);

const { t } = useI18n();

const tableLocation = computed(() =>
  getTableLocationFromDataset(dataset.value)
);
</script>
