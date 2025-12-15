<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonLink variant="ghost" size="sm" :class="classes" :to="to">
    {{ label }}
  </ButtonLink>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import ButtonLink from '../button/ButtonLink.vue';
import { useTabClasses } from './useTabClasses';

const props = defineProps<{
  label: string;
  to?: RouteLocationRaw;
  active?: boolean;
}>();

const { active } = toRefs(props);

const classes = useTabClasses(active);
</script>

<style scoped>
@import './styles.css';
</style>
