<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <CardContainer no-padding>
    <div
      class="flex items-center justify-between bg-gray-50 py-2 text-xl uppercase"
    >
      <TabButton :active="true">
        {{ t('overview.cardTabs.moreInfo') }}
      </TabButton>
    </div>
    <TableCustom>
      <colgroup>
        <col class="w-10 md:w-12" />
        <col class="w-32 md:w-40" />
      </colgroup>
      <TableBody>
        <tr>
          <TableCell>{{ t('overview.cardTabs.output') }}</TableCell>
          <TableCell>{{ dataset.output }}</TableCell>
        </tr>
        <tr>
          <TableCell>{{ t('overview.cardTabs.swaggerUrl') }}</TableCell>
          <TableCell>
            <ExternalLink
              v-if="dataset.swaggerUrl != null"
              class="w-fit wrap-break-word"
              tone="primary"
              :href="dataset.swaggerUrl"
            >
              {{ dataset.swaggerUrl }}
            </ExternalLink>
          </TableCell>
        </tr>
        <tr>
          <TableCell>{{ t('overview.cardTabs.sources') }}</TableCell>
          <TableCell>{{ dataset.sources.join(', ') }}</TableCell>
        </tr>
        <tr>
          <TableCell>{{ t('overview.cardTabs.openData') }}</TableCell>
          <TableCell>{{ t('overview.dataLicence.info') }}</TableCell>
        </tr>
        <tr>
          <TableCell>{{ t('overview.cardTabs.contact') }}</TableCell>
          <TableCell>
            <ExternalLink
              class="w-fit"
              :href="`mailto:${t('contact.email')}`"
              tone="primary"
            >
              {{ t('contact.email') }}
            </ExternalLink>
          </TableCell>
        </tr>
      </TableBody>
    </TableCustom>
  </CardContainer>
</template>

<script setup lang="ts">
import CardContainer from '../../../components/card/CardContainer.vue';
import TabButton from '../../../components/tab/TabButton.vue';
import TableCustom from '../../../components/table/TableCustom.vue';
import TableBody from '../../../components/table/TableBody.vue';
import TableCell from '../../../components/table/TableCell.vue';
import ExternalLink from '../../../components/link/ExternalLink.vue';
import { TourismMetaData } from '../../../domain/metaDataConfig/tourism/types';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{ dataset: TourismMetaData }>();
</script>
