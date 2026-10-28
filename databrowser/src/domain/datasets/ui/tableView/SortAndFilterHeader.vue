<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-center justify-between gap-1">
    {{ title }}
    <div class="flex items-center justify-end gap-1">
      <PopoverCustom v-if="isDeprecated" has-arrow :left-offset="5">
        <template #trigger>
          <PopoverCustomButton class="flex">
            <div class="size-2 rounded-full bg-deprecated"></div>
          </PopoverCustomButton>
        </template>
        <template #container>
          <PopoverCustomPanel>
            <PopoverContent class="max-w-md">
              <h4 class="mb-2 font-semibold">Attribute is deprecated.</h4>

              <p class="mb-5 text-sm">
                A deprecated attribute is one that is phasing out and will not
                be available anymore in the future. It is not recommended to use
                it.
              </p>

              <ButtonExternalLink
                variant="ghost"
                class="flex w-full justify-center"
                href="https://github.com/noi-techpark/odh-docs/wiki/What-does-%22deprecated%22-mean%3F"
                target="_blank"
                >More info
              </ButtonExternalLink>
            </PopoverContent>
          </PopoverCustomPanel>
        </template>
      </PopoverCustom>

      <PopoverCustom v-if="isReference" has-arrow :left-offset="5">
        <template #trigger>
          <PopoverCustomButton class="flex">
            <div class="size-2 rounded-full bg-reference"></div>
          </PopoverCustomButton>
        </template>
        <template #container>
          <PopoverCustomPanel>
            <PopoverContent class="max-w-md">
              <h4 class="mb-2 font-semibold">
                Attribute is referenced from other dataset.
              </h4>

              <p class="mb-5 text-sm">
                This attribute has its origin in another dataset and is added to
                this view.
              </p>

              <ButtonCustom
                variant="ghost"
                class="w-full"
                @click="onGoToReference()"
                >View original dataset ({{ referenceName }})
              </ButtonCustom>
            </PopoverContent>
          </PopoverCustomPanel>
        </template>
      </PopoverCustom>

      <div v-if="!canSort && !canFilter">
        <IconStrokedArrowDown class="size-5 stroke-current" />
      </div>

      <PopoverCustom v-else>
        <template #trigger>
          <PopoverCustomButton
            v-slot="{ open }"
            class="flex items-center rounded-sm"
          >
            <IconStrokedArrowDown
              class="size-5 stroke-current"
              :class="{ 'rotate-180': open }"
            />
            <div class="flex items-center gap-1 text-green-500">
              <IconSortAsc v-if="isCurrentSortAsc" />
              <IconSortDesc v-if="isCurrentSortDesc" />
              <IconFilter v-if="isFilterActive" />
            </div>
          </PopoverCustomButton>
        </template>
        <template #container>
          <PopoverCustomPanel v-slot="{ close }">
            <template v-if="canSort">
              <PopoverContentHeader class="pb-0">Sort</PopoverContentHeader>
              <SortPopoverContent :property-path="propertyPath" />
            </template>

            <template v-if="canFilter">
              <PopoverContentHeader
                :class="[{ 'py-0': canSort, 'pb-0': !canSort }]"
              >
                Filter
              </PopoverContentHeader>
              <FilterPopoverContent
                :property-path="propertyPath"
                :title="title"
                @add-filter="close"
              />
            </template>
          </PopoverCustomPanel>
        </template>
      </PopoverCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import PopoverContentHeader from '../../../../components/popover/PopoverContentHeader.vue';
import PopoverCustom from '../../../../components/popover/PopoverCustom.vue';
import PopoverCustomButton from '../../../../components/popover/PopoverCustomButton.vue';
import PopoverCustomPanel from '../../../../components/popover/PopoverCustomPanel.vue';
import PopoverContent from '../../../../components/popover/PopoverContent.vue';
import IconFilter from '../../../../components/svg/IconFilter.vue';
import IconSortAsc from '../../../../components/svg/IconSortAsc.vue';
import IconSortDesc from '../../../../components/svg/IconSortDesc.vue';
import IconStrokedArrowDown from '../../../../components/svg/IconStrokedArrowDown.vue';
import { PropertyPath } from '../../../datasets/config/types';
import FilterPopoverContent from './filter/FilterPopoverContent.vue';
import SortPopoverContent from './sort/SortPopoverContent.vue';
import { useTableSortForPropertyPath } from './sort/useTableSort';
import { useTableFilterStore } from './filter/tableFilterStore';
import ButtonCustom from '../../../../components/button/ButtonCustom.vue';
import ButtonExternalLink from '../../../../components/button/ButtonExternalLink.vue';
import { useGoToReferenceAttributeDialogStore } from '../common/dialogs/goToReferenceAttributeDialog/goToReferenceAttributeDialogStore';

const goToReferenceAttributeDialogStore =
  useGoToReferenceAttributeDialogStore();

const props = withDefaults(
  defineProps<{
    title: string;
    propertyPath?: PropertyPath;
    isDeprecated?: boolean;
    referenceBasePath?: string;
  }>(),
  { propertyPath: undefined, isDeprecated: false, referenceBasePath: undefined }
);

const { title, propertyPath } = toRefs(props);

const { canSort, isCurrentSortAsc, isCurrentSortDesc } =
  useTableSortForPropertyPath(propertyPath);

const canFilter = useTableFilterStore().canFilter(propertyPath);

const isReference = computed(() => {
  return !!props.referenceBasePath;
});

const referenceName = computed(() => {
  return props.referenceBasePath
    ? props.referenceBasePath.split('/').at(-1) || ''
    : '';
});
const isFilterActive = useTableFilterStore().isFilterActive(propertyPath);

const onGoToReference = () => {
  goToReferenceAttributeDialogStore.referenceUrl = `${window.location.origin}/dataset/table${props.referenceBasePath}`;
  goToReferenceAttributeDialogStore.attributeName = referenceName.value;
  goToReferenceAttributeDialogStore.show();
};
</script>
