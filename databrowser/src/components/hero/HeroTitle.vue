<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <h1 class="title max-w-2xl text-2xl font-bold lg:text-4xl">
    <slot></slot>
  </h1>
</template>

<style scoped>
@reference '@/index.css';

.title {
  line-height: 1.2;
}

@media (width >= theme(--breakpoint-lg)) {
  .title {
    line-height: 1.15;
  }
}
</style>
