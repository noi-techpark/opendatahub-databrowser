<!-- eslint-disable vue/multi-word-component-names -->

<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div ref="target" class="flex">
    <div class="relative w-full">
      <!-- Accordion toggle button -->
      <button
        class="flex w-full items-center justify-between"
        :class="buttonClass"
        @click="toggle"
      >
        <span
          class="mr-2 flex grow items-center justify-start gap-2 text-left"
          :class="buttonLabelClass"
          ><div class="grow">{{ text }}</div>
          <div
            v-if="badgeValue"
            class="rounded bg-gray-200 px-2 text-sm text-gray-900"
          >
            {{ badgeValue }}
          </div></span
        >
        <ArrowLine
          class="size-4 text-green-400 transition"
          :class="show ? '-rotate-90' : 'rotate-90'"
        />
      </button>

      <!-- Accordion menu -->
      <div v-show="show" class="min-w-full">
        <slot :events="{ close }"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import ArrowLine from '../svg/ArrowLine.vue';

const props = defineProps<{
  text: string;
  accordionId: string;
  buttonClass?: string;
  buttonLabelClass?: string;
  badgeValue?: string | number;
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

const emit = defineEmits<{
  (e: 'visible', visible: boolean): void;
}>();
</script>
