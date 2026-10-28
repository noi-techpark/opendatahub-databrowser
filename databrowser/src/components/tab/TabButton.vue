<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonCustom variant="ghost" size="sm" :class="classes">
    <slot></slot>
  </ButtonCustom>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import ButtonCustom from '../button/ButtonCustom.vue';
import { useTabClasses } from './useTabClasses';

const props = defineProps<{ active?: boolean }>();

const { active } = toRefs(props);

const classes = useTabClasses(active);
</script>

<style scoped>
@reference '@/index.css';

@import './styles.css';
</style>
