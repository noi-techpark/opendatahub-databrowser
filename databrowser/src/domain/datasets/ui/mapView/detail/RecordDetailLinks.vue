<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <template v-if="links">
    <div>
      <span class="text-sm font-semibold">
        {{ t('datasets.mapView.recordDetail.recordSpecificInformation') }}
      </span>
      <div class="flex items-center gap-3">
        <ButtonLink
          :to="links.detailLocation"
          :title="t('datasets.listView.viewLinks.detail.title')"
          variant="ghost"
          size="xs"
          class="flex gap-2 px-3 py-1"
        >
          <IconEye class="grow stroke-current" />
          <span class="text-xs uppercase">
            {{ t('datasets.listView.viewLinks.detail.title') }}
          </span>
        </ButtonLink>
        <ButtonLink
          v-if="auth.isAuthenticated"
          :to="links.editLocation"
          :title="t('datasets.listView.viewLinks.edit.title')"
          variant="ghost"
          size="xs"
          class="flex gap-2 px-3 py-1"
        >
          <IconEdit class="grow stroke-current" />
          <span class="text-xs uppercase">
            {{ t('datasets.listView.viewLinks.edit.title') }}
          </span>
        </ButtonLink>
        <ButtonLink
          :title="t('datasets.listView.viewLinks.raw.title')"
          target="_blank"
          variant="ghost"
          size="xs"
          class="flex gap-2 px-3 py-1"
        >
          <IconCode class="grow stroke-current" />
          <span class="text-xs uppercase">
            {{ t('datasets.listView.viewLinks.raw.title') }}
          </span>
        </ButtonLink>
      </div>
    </div>
    <div>
      <span class="text-sm font-semibold">
        {{ t('datasets.mapView.recordDetail.datasetSpecificInformation') }}
      </span>
      <div class="flex items-center gap-3">
        <div v-if="links" class="flex flex-col">
          <InternalLink
            :to="{
              name: 'OverviewDetailPage',
              params: { id: datasetId },
            }"
          >
            {{ t('datasets.mapView.recordDetail.toDatasetDetail') }}
          </InternalLink>
          <InternalLink v-if="links.tableLocation" :to="links.tableLocation">
            {{ t('datasets.mapView.recordDetail.toTableView') }}
          </InternalLink>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonLink from '../../../../../components/button/ButtonLink.vue';
import InternalLink from '../../../../../components/link/InternalLink.vue';
import IconCode from '../../../../../components/svg/IconCode.vue';
import IconEdit from '../../../../../components/svg/IconEdit.vue';
import IconEye from '../../../../../components/svg/IconEye.vue';
import { useAuth } from '../../../../auth/store/auth';
import { DatasetLocations } from '../../../location/types';
import { DatasetId } from '../types';

const { t } = useI18n();

defineProps<{ datasetId?: DatasetId; links?: DatasetLocations }>();

const auth = useAuth();
</script>
