<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverCustom :zIndex="zIndex">
    <template #trigger>
      <PopoverCustomButton class="flex items-center rounded">
        <IconInfo class="text-green-500 h-3 w-3" />
      </PopoverCustomButton>
    </template>
    <template #container>
      <slot></slot>
    </template>
  </PopoverCustom>
</template>

<script setup lang="ts">
import IconInfo from '../svg/IconInfo.vue';
import PopoverCustom from './PopoverCustom.vue';
import PopoverCustomButton from './PopoverCustomButton.vue';

defineProps<{ zIndex?: number }>();
</script>
