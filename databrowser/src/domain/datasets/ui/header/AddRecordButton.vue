<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonLink
    :to="newViewPath"
    size="xs"
    class="h-9 items-center gap-2 px-3 py-[0.35rem] text-base"
  >
    <IconAdd class="h-3 w-auto fill-current" />
    {{ t('datasets.header.addRecord') }}
  </ButtonLink>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonLink from '../../../../components/button/ButtonLink.vue';
import { usePathsForCurrentRoute } from './usePaths';
import IconAdd from '../../../../components/svg/IconAdd.vue';

const { t } = useI18n();

const { newViewPath } = usePathsForCurrentRoute();
</script>
