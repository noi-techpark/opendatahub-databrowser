<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="relative flex items-center">
    <SelectWithIconButton
      id="mobile-language-picker"
      extra-button-classes="h-11"
      :options="views"
      :value="internalPicked"
      :size="SelectSize.xs"
      :show-search-when-at-least-count-options="Infinity"
      :z-index="999"
      label="View"
      :iconComponent="OdhView"
      extra-height
      @change="changePicked"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue';
import { SelectSize } from '../select/types';
import OdhView from '@/components/svg/odh/OdhView.vue';
import SelectWithIconButton from '@/components/select/SelectWithIconButton.vue';
import { useI18n } from 'vue-i18n';
import { DatasetConfigSource } from '@/domain/datasets/config/types.ts';

const { t } = useI18n();

const props = defineProps<{ picked: DatasetConfigSource }>();

const { picked } = toRefs(props);

const emit = defineEmits<{
  (event: 'pickedChange', source: DatasetConfigSource): void;
}>();

const views = [
  {
    label: t('datasets.header.viewUserShortLabel'),
    value: 'user',
  },
  {
    label: t('datasets.header.viewEmbeddedShortLabel'),
    value: 'embedded',
  },
  {
    label: t('datasets.header.viewGeneratedShortLabel'),
    value: 'generated',
  },
];

const internalPicked = ref(picked.value);
watch(picked, () => (internalPicked.value = picked.value));

const changePicked = (value: DatasetConfigSource) => {
  internalPicked.value = value;
  emit('pickedChange', value);
};
</script>
