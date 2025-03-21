<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <HintCustom
    v-if="showMapViewNote"
    type="calm"
    title="Note!"
    @close="hideHint"
  >
    {{ t('datasets.mapView.note') }}
  </HintCustom>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import HintCustom from '../../../../components/hint/HintCustom.vue';

const { t } = useI18n();

const showMapViewNote = useLocalStorage('showMapViewNote', true);

const hideHint = () => (showMapViewNote.value = false);
</script>
