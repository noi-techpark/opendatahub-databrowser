<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <svg
    width="69"
    height="76"
    viewBox="0 0 69 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="{ 'saturate-200': active }"
  >
    <g
      class="hover:cursor-pointer"
      filter="url(#filter0_d_3530_9694)"
      @click="emit('click')"
    >
      <use
        xlink:href="#marker-icon-outer-path"
        fill="white"
        :stroke="active ? 'currentColor' : undefined"
        :stroke-width="active ? 1 : undefined"
      />
      <!-- Background color -->
      <path
        d="M59.4324 30.7162C59.4324 44.3666 48.3666 55.4324 34.7162 55.4324C21.0658 55.4324 10 44.3666 10 30.7162C10 17.0658 21.0658 6 34.7162 6C48.3666 6 59.4324 17.0658 59.4324 30.7162Z"
        fill="currentColor"
      />
      <text
        v-if="title"
        x="50%"
        y="33%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#1C1B1F"
        class="text-lg font-bold"
      >
        {{ title }}
      </text>

      <mask
        id="mask0_3530_9694"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="23"
        y="12"
        width="24"
        height="24"
      >
        <rect x="23" y="12" width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_3530_9694)"></g>
      <path
        d="M23.5 55.5L11.5 43.5L9.5 39.5H60.5L59.5 43L52.5 53.5L45 56.5L31 58L23.5 55.5Z"
        fill="white"
      />
      <text
        v-if="count"
        x="50%"
        y="65%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#1C1B1F"
        class="text-2xs"
      >
        {{ count }}
      </text>
    </g>
    <defs>
      <path
        id="marker-icon-outer-path"
        d="M54.8432 53.2249C61.0773 47.6404 65 39.5283 65 30.5C65 13.6553 51.3447 0 34.5 0C17.6553 0 4 13.6553 4 30.5C4 39.5283 7.92275 47.6404 14.1568 53.2249C14.1776 53.246 14.1984 53.2669 14.2194 53.2879L24.591 63.6595C30.0636 69.1321 38.9364 69.1321 44.409 63.6595L54.7806 53.2879C54.8016 53.2669 54.8224 53.246 54.8432 53.2249Z"
      />
      <clipPath id="marker-icon-clip">
        <use
          xlink:href="#marker-icon-outer-path"
          transform-origin="center"
          transform="scale(1.1)"
          transform-box="fill-box"
        />
      </clipPath>
      <filter
        id="filter0_d_3530_9694"
        x="0"
        y="0"
        width="69"
        height="75.7639"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_3530_9694"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_3530_9694"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'click'): void }>();

withDefaults(
  defineProps<{ title?: string; count?: number; active?: boolean }>(),
  {
    title: undefined,
    count: undefined,
    active: false,
  }
);
</script>
