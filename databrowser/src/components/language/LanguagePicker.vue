<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="relative flex items-center">
    <SelectCustom
      id="mobile-language-picker"
      extra-button-classes="h-11"
      :options="links"
      v-model="selected"
      :size="SelectSize.xs"
      :show-search-when-at-least-count-options="Infinity"
      :z-index="zIndex"
      label="Lang"
      :iconComponent="OdhLanguage"
      extra-height
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  defaultLanguage,
  FilterLanguage,
} from '@/domain/datasets/language';
import { SelectSize } from '../select/types';
import SelectCustom from "@/components/select/SelectCustom.vue";
import OdhLanguage from "@/components/svg/odh/OdhLanguage.vue";

const props = withDefaults(
  defineProps<{
    currentLanguage: string | null | undefined;
    zIndex?: number;
  }>(),
  {
    currentLanguage: defaultLanguage,
    zIndex: undefined,
  }
);

const emit = defineEmits<{
  (event: 'languageChanged', value: string): void;
}>();

const supportedLanguages = Object.values(FilterLanguage);

const router = useRouter();

const links = computed(() => {
  return supportedLanguages.map((language) => {
    const query = {
      ...router.currentRoute.value.query,
      language: language == 'en' ? undefined : language,
    };

    return {
      label: language.toLocaleUpperCase(),
      value: language,
      to: {
        query,
        hash: router.currentRoute.value.hash,
      },
    };
  });
});

const selected = computed({
  get: () => props.currentLanguage ?? defaultLanguage,
  set: (value) => {
    const to = links.value.find((link) => link.value === value)?.to;
    if (to != null) {
      router.push(to);
      emit('languageChanged', value);
    }
  },
});
</script>
