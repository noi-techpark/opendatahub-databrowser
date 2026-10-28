<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverTransition>
    <PopoverPanel v-slot="{ open, close }" class="z-20">
      <div class="rounded-sm bg-white shadow-md ring-1 ring-gray-400">
        <ButtonCustom
          v-if="hasCloseButton"
          :size="Size.xs"
          :variant="Variant.ghost"
          class="float-right m-2 border-none"
          @click="close"
        >
          <IconClose />
        </ButtonCustom>

        <slot :open="open" :close="close"></slot>
      </div>
    </PopoverPanel>
  </PopoverTransition>
</template>

<script setup lang="ts">
import { PopoverPanel } from '@headlessui/vue';
import IconClose from '../svg/IconClose.vue';
import ButtonCustom from '../button/ButtonCustom.vue';
import { Size, Variant } from '../button/types';
import PopoverTransition from './PopoverTransition.vue';

withDefaults(defineProps<{ hasCloseButton?: boolean }>(), {
  hasCloseButton: true,
});
</script>
