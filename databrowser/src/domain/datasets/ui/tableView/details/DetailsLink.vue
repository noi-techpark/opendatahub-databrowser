<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <component
    :is="buttonType"
    :to="to"
    variant="ghost"
    size="xs"
    class="flex h-10 w-11 flex-col items-center p-1 text-green-400 border-lightgray rounded"
    :disabled="disabled"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import ButtonLink from '../../../../../components/button/ButtonLink.vue';

const props = defineProps<{ to?: RouteLocationRaw }>();

const { to } = toRefs(props);

const buttonType = computed(() => (to?.value ? ButtonLink : ButtonCustom));
const disabled = computed(
  () => to?.value == null && buttonType.value.__name === 'ButtonLink'
);
</script>
