<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
  <div class="flex items-center justify-between border-b px-4 py-5 bg-gray-250">
    <div class="flex items-center gap-3">
      <component v-if="iconComponent" :is="iconComponent" class="h-4 w-4 text-green-400 shrink-0 text-primary" />
      <span class="text-lg font-semibold">{{ title }}</span>
      <component v-if="infoComponent" :is="infoComponent"/>
    </div>

    <!-- Close button at the top right -->
    <ButtonCustom
        v-if="showCloseButton"
        :variant="Variant.transparent"
        size="xs"
        class="flex size-8 items-center justify-center self-end"
        data-test="mobile-close-toolBox"
        @click="toolBoxStore.toggleToolBoxSectionKey(ToolBoxSectionKey.NONE)"
    >
      <IconClose class="size-5" />
    </ButtonCustom>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {ToolBoxSectionKey} from "@/domain/datasets/ui/toolBox/types";
import IconClose from "@/components/svg/IconClose.vue";
import ButtonCustom from "@/components/button/ButtonCustom.vue";
import { useToolBoxStore } from './toolBoxStore';
import {Variant} from "@/components/button/types";

const toolBoxStore = useToolBoxStore();

defineProps<{
  title: string;
  iconComponent?: Component;
  infoComponent?: Component;
  showCloseButton: boolean;
}>();
</script>
