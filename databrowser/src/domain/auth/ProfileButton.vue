<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex size-7 items-center justify-center rounded-full text-lg font-bold text-white"
    :class="bgColorClass"
    :title="username"
  >
    <IconUser v-if="username == null" class="size-full" />
    <span v-else>
      {{ letter }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import IconUser from '../../components/svg/IconUser.vue';

const props = defineProps<{ username?: string }>();

const { username } = toRefs(props);

const defaultLetter = '?';

const letter = computed(() =>
  username?.value != null && username.value.length > 0
    ? username.value.at(0)?.toUpperCase()
    : defaultLetter
);

const bgColorClasses = [
  'bg-blue-500',
  'bg-gray-500',
  'bg-green-500',
  'bg-red-500',
  'bg-yellow-500',
];

const bgColorClass = computed(() => {
  if (username.value == null) {
    // Return a default color if the username is not set
    return 'bg-hint-info/10';
  }

  const ascii = letter.value?.charCodeAt(0) ?? 0;
  const colorIndex = ascii % bgColorClasses.length;
  return bgColorClasses[colorIndex];
});
</script>
