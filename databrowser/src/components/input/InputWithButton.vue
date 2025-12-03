<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    :class="[inputWrapperClasses]"
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
      class="w-full border-none bg-transparent pl-0 text-sm focus:ring-0"
      :placeholder="labelPlaceholder"
      :disabled="disabled"
      :data-test="`${id}-input`"
      @keypress.enter="emitConfirmedValue"
    />
    <div class="flex items-center gap-2">
      <button
        class="rounded p-1 text-green-500"
        :class="{ hidden: !hasText }"
        :data-test="`${id}-reset-search`"
        :disabled="!hasText || disabled"
        @click="deleteText"
      >
        <IconClose class="size-4" />
      </button>
      <ButtonCustom
        v-if="hasConfirmButton && !showButtonOnLeft"
        class="-m-1 flex items-center gap-2 rounded p-2 md:px-3 md:py-2"
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
          class="md:text-sm md:font-semibold"
        >
          {{ labelButton }}
        </span>
      </ButtonCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue';
import ButtonCustom from '../button/ButtonCustom.vue';
import { Size } from '../button/types';
import IconClose from '../svg/IconClose.vue';
import { randomId } from '../utils/random';
import { Variant } from '@/components/input/types.ts';
import { computeInputWrapperClasses } from '@/components/input/styles.ts';

const emit = defineEmits(['confirmedValue', 'update:modelValue']);

const props = withDefaults(
  defineProps<{
    variant?: Variant;
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
    variant: Variant.solid,
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

const inputWrapperClasses = computed(() => {
  const variant = props.variant as Variant;
  return computeInputWrapperClasses({
    variant
  });
});

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
