<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
  <UseFullscreen
    v-slot="{ toggle, isFullscreen }"
    class="flex items-center justify-center md:items-stretch"
  >
    <div
      class="group relative flex cursor-pointer justify-center"
      :class="{ 'items-center': !isFullscreen }"
      @click="toggle()"
    >
      <IconExpanded
        v-if="!isFullscreen"
        class="absolute text-white transition-all group-hover:scale-125"
      />
      <slot :is-fullscreen="isFullscreen"></slot>
    </div>
  </UseFullscreen>
</template>

<script setup lang="ts">
import IconExpanded from '../svg/IconExpanded.vue';
import UseFullscreen from './UseFullscreen.vue';
</script>
