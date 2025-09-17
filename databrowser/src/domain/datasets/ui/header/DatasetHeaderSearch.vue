<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ButtonCustom
    variant="ghost"
    :disabled="props.disabled"
    :size="Size.xs"
    class="flex h-9 w-10 items-center justify-center bg-gray-50 md:hidden"
    @click="emit('open', true)"
  >
    <IconSearch />
  </ButtonCustom>
</template>

<script setup lang="ts">
import ButtonCustom from '../../../../components/button/ButtonCustom.vue';
import { Size } from '../../../../components/button/types';
import IconSearch from '../../../../components/svg/IconSearch.vue';

const emit = defineEmits(['open']);
const props = withDefaults(
    defineProps<{
      disabled?: boolean;
    }>(),
    {
      disabled: false,
    }
);

</script>
