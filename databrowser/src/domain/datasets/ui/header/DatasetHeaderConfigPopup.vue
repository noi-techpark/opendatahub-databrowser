<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ThreeDotsPopup large>
    <PopoverCustomPanel class="min-w-64">
      <PopoverContentHeader>
        {{ t('datasets.header.tableSettings') }}
      </PopoverContentHeader>
      <PopoverContentDivider />
      <RadioCustom
        class="p-4 hover:bg-gray-50"
        value="user"
        v-model="source"
        :label="t('datasets.header.viewUserConfig')"
      />
      <PopoverContentDivider />
      <RadioCustom
        class="p-4 hover:bg-gray-50"
        value="embedded"
        v-model="source"
        :label="t('datasets.header.viewEmbeddedConfig')"
      />
      <PopoverContentDivider />
      <RadioCustom
        class="p-4 hover:bg-gray-50"
        value="generated"
        v-model="source"
        :label="t('datasets.header.viewGeneratedConfig')"
      />
    </PopoverCustomPanel>
  </ThreeDotsPopup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PopoverContentDivider from '../../../../components/popover/PopoverContentDivider.vue';
import PopoverContentHeader from '../../../../components/popover/PopoverContentHeader.vue';
import PopoverCustomPanel from '../../../../components/popover/PopoverCustomPanel.vue';
import ThreeDotsPopup from '../../../../components/popover/ThreeDotsPopover.vue';
import RadioCustom from '../../../../components/radio/RadioCustom.vue';
import { DatasetConfigSource } from '../../config/types';

const { t } = useI18n();

const source = defineModel<DatasetConfigSource>({ default: 'embedded' });
</script>
