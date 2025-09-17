<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverGroup>
    <Popover v-slot="{ open }">
      <span ref="trigger" :class="triggerContainerClasses">
        <slot name="trigger" :open="open"></slot>
      </span>

      <Teleport to="#popper-root">
        <div
          ref="container"
          class="absolute"
          :class="{ 'z-50': zIndex == null }"
          :style="{
            zIndex: zIndex == null ? undefined : zIndex,
          }"
        >
          <slot name="container"></slot>

          <PopoverTransition v-if="hasArrow">
            <div
              v-show="open"
              ref="arrow"
              class="absolute size-4 rotate-45 border-gray-400 bg-white"
              :class="arrowClasses"
            ></div>
          </PopoverTransition>
        </div>
      </Teleport>
    </Popover>
  </PopoverGroup>
</template>

<script setup lang="ts">
import { Popover, PopoverGroup } from '@headlessui/vue';
import { computed, ref } from 'vue';
import { useFloatingUi } from '../utils/useFloatingUi';
import PopoverTransition from './PopoverTransition.vue';

const props = withDefaults(
  defineProps<{
    zIndex?: number;
    hasArrow?: boolean;
    offset?: number;
    leftOffset?: number;
    triggerContainerClasses?: string;
  }>(),
  {
    zIndex: undefined,
    hasArrow: false,
    offset: 8,
    leftOffset: undefined,
    triggerContainerClasses: undefined,
  }
);

const arrow = ref();

const [trigger, container, placement] = useFloatingUi({
  placement: 'bottom-start',
  offset: props.offset,
  arrow,
  leftOffset: props.leftOffset,
});

const arrowClasses = computed(() =>
  placement.value.startsWith(`bottom`)
    ? `border-t border-l`
    : placement.value.startsWith(`top`)
      ? `border-b border-r`
      : placement.value.startsWith(`left`)
        ? `border-t border-r`
        : `border-b border-l`
);
</script>
