<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="p-2 md:px-6 md:py-3">
    <header class="flex items-center justify-between gap-2">
      <div>
        <span class="text-xl">
          {{
            t('datasets.mapView.headerBig', {
              selectedDatasetCount,
              recordCount: selectedDatasetRecordsCount,
            })
          }}
        </span>
        <span>
          {{
            t('datasets.mapView.headerSmall', {
              datasetCount,
            })
          }}
        </span>
      </div>
      <div class="relative flex items-center gap-2">
        <LanguagePicker
          class="hidden md:flex"
          :current-language="currentLanguage"
          :z-index="mapViewSubComponentZIndex"
        />
        <ButtonCustom
          :size="Size.xs"
          :variant="Variant.ghost"
          class="flex size-9 items-center justify-center"
          @click="emit('close')"
        >
          <IconClose />
        </ButtonCustom>
      </div>
    </header>

    <div class="flex justify-between gap-2 md:hidden">
      <ButtonCustom
        class="flex w-full items-center justify-center gap-2"
        :variant="Variant.ghost"
        :size="Size.sm"
        :indicator="showFilter"
        @click="showFilter = !showFilter"
      >
        <IconDataset />
        {{ t('datasets.mapView.dataset') }}
      </ButtonCustom>
      <ButtonCustom
        class="flex w-full items-center justify-center gap-2"
        :variant="Variant.ghost"
        :size="Size.sm"
        :indicator="true"
        :disabled="true"
      >
        <IconFilter />
        {{ t('datasets.mapView.filter') }}
      </ButtonCustom>
      <LanguagePicker
        class="md:hidden"
        :current-language="currentLanguage"
        :z-index="mapViewSubComponentZIndex"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ButtonCustom from '../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '../../../../components/button/types';
import LanguagePicker from '../../../../components/language/LanguagePicker.vue';
import IconClose from '../../../../components/svg/IconClose.vue';
import IconDataset from '../../../../components/svg/IconDataset.vue';
import IconFilter from '../../../../components/svg/IconFilter.vue';
import { defaultLanguage } from '../../language';
import { mapViewSubComponentZIndex } from './consts';
import { useMapViewStore } from './store/useMapViewStore';
import { useMapViewUiStore } from './store/useMapViewUiStore';

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { datasetCount, selectedDatasetRecordsCount, selectedDatasetCount } =
  storeToRefs(useMapViewStore());

const router = useRouter();
const currentLanguage = computedAsync(
  () =>
    (router.currentRoute.value.query.language as string | undefined) ??
    defaultLanguage
);

const { showFilter } = storeToRefs(useMapViewUiStore());
</script>
