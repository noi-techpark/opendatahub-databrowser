<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverCustom :z-index="mapViewBaseZIndex + 1">
    <template #trigger>
      <PopoverCustomButton class="flex items-center rounded">
        <IconWarning class="text-red-500" />
      </PopoverCustomButton>
    </template>
    <template #container>
      <PopoverCustomPanel>
        <PopoverContent class="text-red-500">
          <slot></slot>
        </PopoverContent>
      </PopoverCustomPanel>
    </template>
  </PopoverCustom>
</template>

<script setup lang="ts">
import PopoverContent from '../../../../../components/popover/PopoverContent.vue';
import PopoverCustom from '../../../../../components/popover/PopoverCustom.vue';
import PopoverCustomButton from '../../../../../components/popover/PopoverCustomButton.vue';
import PopoverCustomPanel from '../../../../../components/popover/PopoverCustomPanel.vue';
import IconWarning from '../../../../../components/svg/IconWarning.vue';
import { mapViewBaseZIndex } from '../consts';
</script>
