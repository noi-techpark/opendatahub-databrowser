<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseSettingsToggle
    :label="t('datasets.detailView.showDeprecatedFields')"
    :description="
      hasDescription ? t('datasets.detailView.showDeprecatedFieldsDesc') : ''
    "
    active-color-class="deprecated"
    :active="!!toolBoxStore.settings.showDeprecated"
    :use-wrapper-classes="useWrapperClasses"
    :use-container-classes="useContainerClasses"
    :custom-wrapper-classes="customWrapperClasses"
    :custom-text-classes="customTextClasses"
    :has-bullet="true"
  >
    <template #toggle>
      <ToggleCustom
        v-model="toolBoxStore.settings.showDeprecated"
        :disabled="disabled"
        inactive-bg-class="bg-gray-400"
        inactive-border-class="border-gray-400"
        class="shrink-0"
        data-test="show-deprecated-fields"
      />
    </template>
    <template #info>
      <InfoDeprecated class="pt-1"></InfoDeprecated>
    </template>
  </BaseSettingsToggle>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ToggleCustom from '../../../../../components/toggle/ToggleCustom.vue';
import { useToolBoxStore } from '../../toolBox/toolBoxStore';
import BaseSettingsToggle from '../BaseSettingsToggle.vue';
import InfoDeprecated from '@/domain/datasets/ui/tableView/toolBox/InfoDeprecated.vue';

const { t } = useI18n();

const toolBoxStore = useToolBoxStore();

withDefaults(
  defineProps<{
    disabled?: boolean;
    hasDescription?: boolean;
    useContainerClasses?: boolean;
    useWrapperClasses?: boolean;
    customWrapperClasses?: string;
    customTextClasses?: string;
  }>(),
  {
    disabled: false,
    hasDescription: false,
    useContainerClasses: true,
    useWrapperClasses: true,
    customWrapperClasses: '',
    customTextClasses: '',
  }
);
</script>
