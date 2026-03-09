<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <AlertError :title="t('datasets.error.json.title')">
    {{t('datasets.error.json.text')}}
  </AlertError>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AlertError from '@/components/alert/AlertError.vue';

const { t } = useI18n();
</script>
