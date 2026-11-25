<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonCustom
    variant="ghost"
    size="xs"
    :class="buttonClass"
    @click="emit('expandAll')"
  >
    <IconExpandAll class="mx-1.5 size-4 text-green-400" />
    <span class="ml-1 text-gray-950">{{
      t('components.jsonViewer.expandAll')
    }}</span>
  </ButtonCustom>
  <ButtonCustom
    variant="ghost"
    size="xs"
    :class="buttonClass"
    @click="emit('collapseAll')"
  >
    <IconCollapseAll class="mx-1.5 size-4 text-green-400" />
    <span class="ml-1 text-gray-950">{{
      t('components.jsonViewer.collapseAll')
    }}</span>
  </ButtonCustom>
  <ButtonCustom
    variant="ghost"
    size="xs"
    :class="buttonClass"
    @click="copy(JSON.stringify(data, null, 2))"
  >
    <IconCopy v-if="!copied" class="mx-1.5 size-4 text-green-400" />
    <IconCheck v-else class="mx-1.5 size-4 text-green-400" />
    <span class="ml-1 text-gray-950">{{
      copied
        ? t('components.jsonViewer.copied')
        : t('components.jsonViewer.copyJson')
    }}</span>
  </ButtonCustom>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import IconCheck from '../../../../../components/svg/IconCheck.vue';
import IconCollapseAll from '../../../../../components/svg/IconCollapseAll.vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconExpandAll from '../../../../../components/svg/IconExpandAll.vue';

// Buttons shown above a JsonMonacoViewer
defineProps<{ data: unknown }>();

const emit = defineEmits<{
  (e: 'expandAll'): void;
  (e: 'collapseAll'): void;
}>();

const { t } = useI18n();

const { copy, copied } = useClipboard();

// Same look as the buttons in the dataset header (DatasetHeaderButton)
const buttonClass = 'flex h-11 items-center justify-center px-2 text-base';
</script>
