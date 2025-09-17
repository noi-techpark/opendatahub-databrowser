<!-- eslint-disable vue/multi-word-component-names -->

<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="target" class="flex">
    <div class="relative w-full">
      <!-- Dropdown toggle button -->
      <button
        class="flex w-full items-center justify-between"
        :class="buttonClass"
        @click="toggle"
      >
        <span :class="buttonLabelClass">{{ text }}</span>
        <ArrowUp v-if="show" />
        <ArrowDown v-else />
      </button>

      <!-- Dropdown menu -->
      <div
        v-show="show"
        class="absolute z-[999] min-w-full border bg-white shadow-xl"
      >
        <slot :events="{ close }"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { onClickOutside } from '@vueuse/core';
import ArrowDown from '../svg/ArrowDown.vue';
import ArrowUp from '../svg/ArrowUp.vue';

const props = defineProps<{
  text: string;
  buttonClass?: string;
  buttonLabelClass?: string;
}>();
const { text, buttonClass, buttonLabelClass } = toRefs(props);

const show = ref(false);

const target = ref(null);

const close = () => {
  show.value = false;
  emit('visible', show.value);
};

const toggle = () => {
  show.value = !show.value;
  emit('visible', show.value);
};

onClickOutside(target, () => close());

const emit = defineEmits<{
  (e: 'visible', visible: boolean): void;
}>();
</script>
