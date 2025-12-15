<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>

  <!-- ToolBox content -->
  <div
    class="absolute top-0 z-[10] flex h-full flex-col overflow-x-auto bg-gray-50 transition-all md:relative"
    :class="{
      'w-full md:w-1/3': activeSection,
      'w-0': !activeSection,
      'bg-white': isWhite,
    }"
  >
    <div
      class="flex flex-1 overflow-y-auto md:block"
      :class="{ block: activeSection, hidden: !activeSection }"
    >
      <Transition
        @after-enter="
          (el: Element) => (el.classList.value = 'block h-full w-full')
        "
        @before-leave="(el: Element) => (el.classList.value = 'hidden')"
      >
        <div v-if="activeSection" :class="{ hidden: !mdAndLarger }">
          <ContentAlignmentX class="h-full" :noPadding="true" >
            <div class="flex flex-col justify-between">
              <div
                class="sticky top-0 z-10 flex flex-col justify-end bg-gray-50"
                :class="{
                  'bg-white': isWhite,
                }"
              >
                <ToolBoxSectionHeader
                  :title="activeSection.title"
                  :iconComponent="activeSection.iconComponent"
                  :infoComponent="activeSection.infoComponent"
                  :showCloseButton="true"
                />
              </div>

              <div class="flex-1 overflow-y-auto p-2">
                <component
                    v-if="activeSection"
                    :is="activeSection.vnode"
                />
              </div>
            </div>
          </ContentAlignmentX>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, watch, useSlots, VNode} from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import ContentAlignmentX from '../../../../components/content/ContentAlignmentX.vue';
import { useToolBoxStore } from './toolBoxStore';
import {
  ToolBoxSection,
  ToolBoxSectionKey,
} from '@/domain/datasets/ui/toolBox/types';
import ToolBoxSectionHeader from "@/domain/datasets/ui/toolBox/ToolBoxSectionHeader.vue";

withDefaults(
  defineProps<{
    isWhite?: boolean;
    hideExpandOnDesktop?: boolean;
    openToolBoxButtonLabel?: string;
    closeToolBoxButtonLabel?: string;
  }>(),
  {
    isWhite: false,
    hideExpandOnDesktop: false,
    openToolBoxButtonLabel: '',
    closeToolBoxButtonLabel: '',
  }
);

const slots = useSlots();
const toolBoxStore = useToolBoxStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greater('md');

const sections = computed(() => {
  const vnodes = (slots.default?.() ?? []) as VNode[];
  return vnodes
      .map((vnode) => {
        if (!vnode.props) return undefined;
        return {
          ...(vnode.props as ToolBoxSection),
          vnode, // salvi il vnode intero
        };
      })
      .filter(Boolean) as (ToolBoxSection & { vnode: VNode })[];
});

const activeSection = computed(() =>
    sections.value.find((s) => s.sectionKey === toolBoxStore.activeSectionKey)
);

watch(mdAndLarger, (newVal) => {
  if (newVal) return;

  toolBoxStore.toggleToolBoxSectionKey(ToolBoxSectionKey.NONE);
});
</script>

<style scoped>
.v-enter-active {
  transition: all 0.2s ease;
}

.expand-bt-text {
  writing-mode: vertical-lr;
  text-orientation: mixed;
}
</style>
