<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <PopoverContent class="flex items-center gap-3 pt-2">
    <ButtonCustom
      class="flex basis-1/2 items-center gap-2 p-2"
      :variant="Variant.ghost"
      :size="Size.xs"
      @click="setSort(isCurrentSortAsc ? 'none' : 'asc')"
    >
      <CheckboxCustom :model-value="isCurrentSortAsc" :tabbable="false" />
      Ascending
      <IconSortAsc class="size-5" />
    </ButtonCustom>
    <ButtonCustom
      class="flex basis-1/2 items-center gap-2 p-2"
      :variant="Variant.ghost"
      :size="Size.xs"
      @click="setSort(isCurrentSortDesc ? 'none' : 'desc')"
    >
      <CheckboxCustom :model-value="isCurrentSortDesc" :tabbable="false" />
      Descending
      <IconSortDesc class="size-5" />
    </ButtonCustom>
  </PopoverContent>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import ButtonCustom from '../../../../../components/button/ButtonCustom.vue';
import { Size, Variant } from '../../../../../components/button/types';
import CheckboxCustom from '../../../../../components/checkbox/CheckboxCustom.vue';
import PopoverContent from '../../../../../components/popover/PopoverContent.vue';
import IconSortAsc from '../../../../../components/svg/IconSortAsc.vue';
import IconSortDesc from '../../../../../components/svg/IconSortDesc.vue';
import { useTableSortForPropertyPath } from './useTableSort';

const props = withDefaults(defineProps<{ propertyPath?: string }>(), {
  propertyPath: undefined,
});

const { propertyPath } = toRefs(props);

const { isCurrentSortAsc, isCurrentSortDesc, setSort } =
  useTableSortForPropertyPath(propertyPath);
</script>
