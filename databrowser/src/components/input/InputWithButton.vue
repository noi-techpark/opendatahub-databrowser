<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex h-9 items-center justify-between gap-2 rounded border border-gray-400 bg-white p-2 py-5 text-black focus-within:border-green-500 focus-within:bg-green-500/10 md:p-2"
  >
    <slot v-if="showIcon" name="icon"></slot>
    <ButtonCustom
      v-if="hasConfirmButton && showButtonOnLeft"
      class="flex h-3 items-center gap-2 rounded p-2"
      aria-label="Search"
      :size="Size.xs"
      :disabled="disabled"
      :data-test="`${id}-start-search`"
      variant="transparent"
      @click="emitConfirmedValue"
    >
      <slot v-if="showIconInButton" name="icon"></slot>
      <span
        v-if="labelButton"
        :class="{ 'hidden md:inline': !showButtonTextMobile }"
        >{{ labelButton }}</span
      >
    </ButtonCustom>
    <input
      :id="id"
      ref="inputRef"
      v-model="text"
      class="w-full border-none bg-transparent focus:ring-0"
      :placeholder="labelPlaceholder"
      :disabled="disabled"
      :data-test="`${id}-input`"
      @keypress.enter="emitConfirmedValue"
    />
    <div class="flex items-center gap-2">
      <button
        class="p-[3px] text-green-500"
        :class="{ hidden: !hasText }"
        :data-test="`${id}-reset-search`"
        :disabled="!hasText || disabled"
        @click="deleteText"
      >
        <IconClose class="size-4" />
      </button>
      <ButtonCustom
        v-if="hasConfirmButton && !showButtonOnLeft"
        class="-m-1 flex items-center gap-2 rounded p-2 md:px-3 md:py-1"
        aria-label="Search"
        :size="Size.xs"
        :disabled="disabled"
        :data-test="`${id}-start-search`"
        @click="emitConfirmedValue"
      >
        <slot v-if="showIconInButton" name="icon"></slot>
        <span
          v-if="labelButton"
          :class="{ 'hidden md:inline': !showButtonTextMobile }"
          >{{ labelButton }}</span
        >
      </ButtonCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue';
import ButtonCustom from '../button/ButtonCustom.vue';
import { Size } from '../button/types';
import { randomId } from '../utils/random';
import IconClose from '../svg/IconClose.vue';

const emit = defineEmits(['confirmedValue', 'update:modelValue']);

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
    focus?: boolean;
    id?: string;
    labelButton?: string;
    labelPlaceholder?: string;
    showButtonOnLeft?: boolean;
    showIconInButton?: boolean;
    showIcon?: boolean;
    showButtonTextMobile?: boolean;
    showConfirmButton?: boolean;
  }>(),
  {
    modelValue: undefined,
    disabled: undefined,
    focus: undefined,
    id: randomId(),
    labelButton: undefined,
    labelPlaceholder: undefined,
    showButtonOnLeft: false,
    showIconInButton: true,
    showConfirmButton: true,
  }
);

const text = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => (text.value = value)
);

watch(
  () => text.value,
  (value) => emit('update:modelValue', value)
);

const inputRef = ref();
const focusInput = () =>
  setTimeout(() => {
    if (inputRef.value != null) {
      inputRef.value.focus();
    }
  }, 500);

onMounted(() => {
  if (props.focus === true) {
    focusInput();
  }
});

const hasText = computed(() => text.value?.length ?? 0 > 0);

const deleteText = () => {
  text.value = '';
  emitConfirmedValue();
  focusInput();
};

const emitConfirmedValue = () => emit('confirmedValue', text.value);

const slots = useSlots();
const hasConfirmButton = computed(
  () =>
    props.showConfirmButton &&
    (props.labelButton != null || slots['icon'] != null)
);
</script>
