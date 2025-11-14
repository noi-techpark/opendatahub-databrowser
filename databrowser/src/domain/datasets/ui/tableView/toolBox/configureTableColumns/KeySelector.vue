<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverCustom>
    <template #trigger>
      <PopoverCustomButton
        :disabled="disabled"
        :class="
          computeButtonClasses({
            size: Size.sm,
            disabled,
          })
        "
      >
        {{ buttonText }}
      </PopoverCustomButton>
    </template>
    <template #container>
      <PopoverCustomPanel :has-close-button="false" v-slot="{ close }">
        <ul>
          <li v-for="key in keys" :key="key" class="hover:bg-gray-100">
            <button
              class="w-full px-3 py-2 text-left"
              @click="
                emit('selectKey', key);
                close();
              "
            >
              {{ key }}
            </button>
          </li>
        </ul>
      </PopoverCustomPanel>
    </template>
  </PopoverCustom>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { computeButtonClasses } from '../../../../../../components/button/styles';
import { Size } from '../../../../../../components/button/types';
import PopoverCustom from '../../../../../../components/popover/PopoverCustom.vue';
import PopoverCustomButton from '../../../../../../components/popover/PopoverCustomButton.vue';
import PopoverCustomPanel from '../../../../../../components/popover/PopoverCustomPanel.vue';

const emit = defineEmits<{ (e: 'selectKey', key: string): void }>();

const props = defineProps<{ keys: string[]; buttonText: string }>();

const disabled = computed(() => props.keys.length === 0);
</script>
