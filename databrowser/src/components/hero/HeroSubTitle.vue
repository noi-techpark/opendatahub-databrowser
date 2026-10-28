<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <h2 class="sub-title mt-2 max-w-2xl leading-tight text-gray-600 lg:mt-0">
    <slot></slot>
  </h2>
</template>

<style scoped>
@reference '@/index.css';

.sub-title {
  font-size: 1.375rem;
}

@media (width >= theme(--breakpoint-lg)) {
  .sub-title {
    font-size: 1.625rem;
  }
}
</style>
