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
import { useI18n } from 'vue-i18n';
import HintCustom from '../../../../components/hint/HintCustom.vue';
import { useUserSettings } from '../../../user/userSettings';

const { t } = useI18n();

const userSettings = useUserSettings();

const showMapViewNote =
  userSettings.getUserSettingRef<boolean>('showMapViewNote');

const hideHint = () => userSettings.updateUserSetting('showMapViewNote', false);
</script>
