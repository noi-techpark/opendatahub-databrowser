<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <SelectCustom
      id="mobile-main-category"
      class="md:hidden"
      :model-value="slug"
      :options="selectOptions"
      :show-search-when-at-least-count-options="Infinity"
      @update:model-value="setSelectedCategory"
    />

    <div class="hidden flex-col md:flex">
      <div
        v-for="category in categories"
        :key="category.slug"
        class="flex-col md:flex"
      >
        <PillLink
          class="px-4 py-1"
          :to="categoryRouteLocation(category)"
          :active="slug === category.slug"
          :data-test="`desktop-main-category-${category.slug}`"
          :class="{
            'flex items-center justify-between gap-2':
              category.subElements != null,
          }"
          @click="emit('change', category.slug)"
        >
          <span :class="{ 'text-error': category.isAnyPropertyError === true }">
            {{ computeLabel(category.name, category.isAnyPropertyRequired) }}
          </span>
          <ArrowUp
            v-if="category.subElements != null"
            class="transition-all"
            :class="{
              'rotate-180':
                visibleCategorySubElements(category.subElements).length > 0 &&
                !isActiveWithSubElements(category),
            }"
          />
        </PillLink>
        <PillLink
          v-for="subEl in visibleCategorySubElements(category.subElements)"
          :key="subEl.slug"
          class="py-1 pl-8 pr-4"
          :to="categoryRouteLocation(subEl)"
          :active="slug === subEl.slug"
          :data-test="`desktop-main-category-sub-el-${subEl.slug}`"
          :class="{
            hidden: !isActiveWithSubElements(category),
          }"
          @click="emit('change', subEl.slug)"
        >
          <span :class="{ 'text-error': subEl.isAnyPropertyError === true }">
            {{ computeLabel(subEl.name, subEl.isAnyPropertyRequired) }}
          </span>
        </PillLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import PillLink from '../../../../components/pill/PillLink.vue';
import SelectCustom from '../../../../components/select/SelectCustom.vue';
import { SelectOption, SelectValue } from '../../../../components/select/types';
import ArrowUp from '../../../../components/svg/ArrowUp.vue';
import { Category, SubElementCategory } from './types';

const emit = defineEmits(['change']);

const props = defineProps<{
  categories: Category[];
  slug?: string;
}>();

const { categories, slug } = toRefs(props);

const computeLabel = (name: string, isAnyPropertyRequired?: boolean) =>
  name + (isAnyPropertyRequired ? ' *' : '');

const selectOptions = computed<SelectOption[]>(() =>
  categories.value.map((category) => ({
    label: computeLabel(category.name, category.isAnyPropertyRequired),
    value: category.slug,
  }))
);

const router = useRouter();

const setSelectedCategory = (slug: SelectValue | undefined) => {
  const nextCategory = categories.value.find(
    (category) => category.slug === slug
  );

  if (nextCategory != null) {
    router.replace(categoryRouteLocation(nextCategory));
  }
};

const categoryRouteLocation = (category: Category) => ({
  hash: `#${category.slug}`,
  query: router.currentRoute.value.query,
});

const visibleCategorySubElements = (categories?: SubElementCategory[]) => {
  return (categories ?? [])
    .filter((item) => item.elements.visible)
    .map((item) => item.elements);
};

const isActiveWithSubElements = (category: Category) => {
  if (!category.subElements) return false;

  return (
    slug.value === category.slug ||
    !!category.subElements.find((item) => item.elements.slug === slug.value)
  );
};
</script>
