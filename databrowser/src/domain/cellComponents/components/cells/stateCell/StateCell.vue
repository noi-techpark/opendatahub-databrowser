<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <TagCustom
    v-if="state != null"
    :text="state === true ? 'True' : 'False'"
    :type="state === true ? 'blue' : 'red'"
    has-dot
  />
</template>

<script setup lang="ts">
import TagCustom from '../../../../../components/tag/TagCustom.vue';

withDefaults(
  defineProps<{
    state?: boolean;
  }>(),
  {
    state: undefined,
  }
);
</script>
