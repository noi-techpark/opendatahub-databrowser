<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <UseClickableFullscreen v-if="allowFullscreen && hasUsableSource">
    <img
      v-bind="$attrs"
      :src="imgSrc"
      :alt="alt"
      :style="style"
      @error="hasLoadingError = true"
    />
  </UseClickableFullscreen>
  <img
    v-else-if="!allowFullscreen && hasUsableSource"
    v-bind="$attrs"
    :src="imgSrc"
    :alt="alt"
    :style="style"
    @error="hasLoadingError = true"
  />
  <PlaceholderImage v-else />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UseClickableFullscreen from '../../../../../components/fullscreen/UseClickableFullscreen.vue';
import PlaceholderImage from '../../../../../components/image/PlaceholderImage.vue';
import { getImageSrc } from '../../../../image';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';

const props = withDefaults(
  defineProps<{
    width?: string;
    alt?: string;
    src?: string;
    allowFullscreen?: boolean | string;
  }>(),
  {
    width: '100%',
    alt: undefined,
    src: undefined,
    allowFullscreen: false,
  }
);

const hasLoadingError = ref(false);

const imgSrc = ref<string>();
const style = ref<Record<string, string>>();

const allowFullscreen = computed(() =>
  booleanOrStringToBoolean(props.allowFullscreen)
);

const hasUsableSource = computed(
  () => props.src != null && !hasLoadingError.value
);

watch(
  props,
  ({ src, width }) => {
    // Apply default settings
    imgSrc.value = src;
    style.value = undefined;

    // If no width is given, default settings are correct
    if (width == null) {
      return;
    }

    const isPercentageWidth = width.trim().endsWith('%');

    if (isPercentageWidth) {
      style.value = { width };
    } else {
      const widthAsNumber = Number(width);

      // If width is a number, than adapt URL
      if (!isNaN(widthAsNumber)) {
        imgSrc.value = getImageSrc(src, {
          resize: true,
          preferredWidth: widthAsNumber,
        });
      }
    }
  },
  { immediate: true }
);
</script>
