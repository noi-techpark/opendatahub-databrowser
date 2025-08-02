<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <HintCustom v-if="showEditHint" type="calm" title="Hint!" @close="hideHint">
    You can edit all data. Be aware that some data is synched from other
    sources. That’s why some of your changes may be overwritten. Check
    <ExternalLink
      href="https://opendatahub.readthedocs.io/en/latest/index.html"
      tone="white"
      >documentation</ExternalLink
    >
    or contact
    <ExternalLink href="mailto:support@opendatahub.com" tone="white">
      support@opendatahub.com</ExternalLink
    >
    for more info!
  </HintCustom>
</template>

<script setup lang="ts">
import HintCustom from '../../../../components/hint/HintCustom.vue';
import ExternalLink from '../../../../components/link/ExternalLink.vue';
import { useUserSettings } from '../../../user/userSettings';

const userSettings = useUserSettings();

const showEditHint = userSettings.getUserSettingRef<boolean>('showEditHint');

const hideHint = () => userSettings.updateUserSetting('showEditHint', false);
</script>
