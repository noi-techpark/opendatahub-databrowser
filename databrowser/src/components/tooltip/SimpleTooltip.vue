<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->


<template>
  <!-- Trigger -->
  <span
      v-if="$slots.trigger"
      ref="trigger"
      @mouseenter="open"
      @mouseleave="close"
      @focusin="open"
      @focusout="close"
  >
    <slot name="trigger"></slot>
  </span>

  <!-- Tooltip -->
  <div
      ref="container"
      class="absolute pointer-events-auto transition-opacity duration-150 bg-gray-700 text-white text-sm rounded px-2 py-1 max-w-xs break-words shadow-lg"
      :class="[
      { 'z-50': zIndex == null },
      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    ]"
      :style="{ zIndex: zIndex == null ? undefined : zIndex }"
      @mouseenter="open"
      @mouseleave="close"
      role="tooltip"
  >
    {{ text }}
    <div ref="arrow" class="tooltip-arrow" data-placement="arrow" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, withDefaults, defineProps } from 'vue'
import { useFloatingUi } from '@/components/utils/useFloatingUi'
import { Placement } from '@floating-ui/dom';

const props = withDefaults(
    defineProps<{
      text: string
      zIndex?: number
      offset?: number
      leftOffset?: number
      openDelay?: number
      closeDelay?: number
      placement?: Placement
    }>(),
    {
      zIndex: undefined,
      offset: 8,
      leftOffset: undefined,
      openDelay: 60,
      closeDelay: 80,
      placement: 'left', // tooltip a sinistra
    }
)

const isOpen = ref(false)
let openTimer: number | undefined
let closeTimer: number | undefined

const arrow = ref<HTMLElement | null>(null)

// usa il composable aggiornato (placement dinamico)
const [trigger, container] = useFloatingUi({
  placement: props.placement as Placement,
  offset: props.offset,
  arrow,
  leftOffset: props.leftOffset,
})

const open = () => {
  if (closeTimer) clearTimeout(closeTimer)
  openTimer = window.setTimeout(() => (isOpen.value = true), props.openDelay)
}
const close = () => {
  if (openTimer) clearTimeout(openTimer)
  closeTimer = window.setTimeout(() => (isOpen.value = false), props.closeDelay)
}

onBeforeUnmount(() => {
  if (openTimer) clearTimeout(openTimer)
  if (closeTimer) clearTimeout(closeTimer)
})
</script>

<style scoped>
.tooltip-arrow {
  --tw-tooltip-bg: #343434;
  position: absolute;
  width: 0;
  height: 0;
}

[data-placement^='left'] .tooltip-arrow {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid var(--tw-tooltip-bg);
}
[data-placement^='right'] .tooltip-arrow {
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid var(--tw-tooltip-bg);
}
[data-placement^='top'] .tooltip-arrow {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--tw-tooltip-bg);
}
[data-placement^='bottom'] .tooltip-arrow {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid var(--tw-tooltip-bg);
}
</style>
