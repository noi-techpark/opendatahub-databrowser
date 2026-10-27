<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonCustom
    variant="ghost"
    size="xs"
    class="mr-2 flex h-6 items-center bg-white px-3 py-1 md:mr-9"
  >
    <IconStrokedArrowDown class="mr-1 -ml-1 size-5 rotate-90 stroke-current" />
    <span class="line-height-1">{{ label }}</span>
  </ButtonCustom>
</template>

<script setup lang="ts">
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import IconStrokedArrowDown from '../../../../../components/svg/IconStrokedArrowDown.vue';

defineProps<{ label: string }>();
</script>
