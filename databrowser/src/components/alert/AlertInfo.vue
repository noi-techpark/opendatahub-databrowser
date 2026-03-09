<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseAlert :title="title" :hasCloseButton="true" type="info" @close="emit('close')" >
    <template v-if="content">{{ content }}</template>
  </BaseAlert>
</template>

<script setup lang="ts">
import BaseAlert from './BaseAlert.vue';

defineProps<{
  title?: string;
  content?: string;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

</script>
