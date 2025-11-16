<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { useCanonicalHead } from './domain/contentpage/head/canonicalHead';

// Head injection: set canonical URL
useCanonicalHead();
</script>

<style>
@font-face {
  font-family: 'SourceSansPro';
  font-weight: 400;
  font-style: normal;
  font-display: auto;
  src: url('/fonts/SourceSansPro-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'SourceSansPro';
  font-weight: 600;
  font-style: normal;
  font-display: auto;
  src: url('/fonts/SourceSansPro-SemiBold.ttf') format('truetype');
}

@font-face {
  font-family: 'SourceSansPro';
  font-weight: 700;
  font-style: normal;
  font-display: auto;
  src: url('/fonts/SourceSansPro-Bold.ttf') format('truetype');
}
</style>
