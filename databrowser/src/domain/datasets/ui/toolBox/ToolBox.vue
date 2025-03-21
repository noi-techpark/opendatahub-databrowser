<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- Mobile toolBox open button -->
  <ButtonCustom
    v-if="!toolBoxStore.visible"
    class="absolute bottom-10 right-0 z-20 flex rotate-0 items-center justify-center rounded-r-none shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)] sm:block md:hidden"
    data-test="mobile-open-toolBox"
    @click="toolBoxStore.toggleToolboxVisibility(!toolBoxStore.visible)"
  >
    <IconAdd class="mr-2 size-5" />
    <span>Toolbox</span>
  </ButtonCustom>

  <!-- ToolBox content -->
  <div
    class="absolute top-0 z-10 flex h-full flex-col overflow-x-auto bg-gray-50 transition-all md:relative"
    :class="{
      'w-full md:w-1/3': toolBoxStore.visible,
      'w-0 md:w-[4.5rem]': !toolBoxStore.visible,
      'bg-white': isWhite,
    }"
  >
    <div
      class="flex flex-1 overflow-y-auto md:block md:pl-14"
      :class="{ block: toolBoxStore.visible, hidden: !toolBoxStore.visible }"
    >
      <Transition
        @after-enter="
          (el: Element) => (el.classList.value = 'block h-full w-full')
        "
        @before-leave="(el: Element) => (el.classList.value = 'hidden')"
      >
        <div v-if="toolBoxStore.visible" :class="{ hidden: !mdAndLarger }">
          <ContentAlignmentX class="h-full">
            <div class="flex flex-col justify-between">
              <TabGroup :default-index="defaultIndex">
                <div
                  class="sticky top-0 z-10 flex flex-col justify-end bg-gray-50 pt-3"
                  :class="{
                    'bg-white': isWhite,
                  }"
                >
                  <!-- Close button at the top right -->
                  <ButtonCustom
                    variant="ghost"
                    size="xs"
                    class="mr-2 mt-6 flex size-8 items-center justify-center self-end md:hidden"
                    data-test="mobile-close-toolBox"
                    @click="toolBoxStore.toggleToolboxVisibility(false)"
                  >
                    <IconClose class="size-5" />
                  </ButtonCustom>

                  <!-- Tab navigation -->
                  <TabList class="mb-8 mt-2 flex justify-around md:mt-0">
                    <Tab
                      v-for="(tabName, index) in tabNames"
                      :key="tabName"
                      v-slot="{ selected }"
                      as="template"
                    >
                      <TabButton
                        :active="selected"
                        class="mt-px"
                        :data-test="`toolBox-tab-${index}`"
                      >
                        {{ tabName }}
                      </TabButton>
                    </Tab>
                  </TabList>
                </div>

                <TabPanels class="mb-4">
                  <slot></slot>
                </TabPanels>
              </TabGroup>
            </div>
          </ContentAlignmentX>
        </div>
      </Transition>
    </div>

    <!-- Open / close button -->
    <div
      class="absolute bottom-0 my-3 ml-2 hidden w-14 flex-col gap-2 bg-white px-3 pb-3 pt-4 md:inline-block"
      :class="{
        'md:hidden': hideExpandOnDesktop,
      }"
    >
      <div
        class="expand-bt-text mb-3 flex w-full rotate-180 items-center justify-center text-green-400"
      >
        {{
          !toolBoxStore.visible
            ? openToolBoxButtonLabel ||
              t('datasets.toolBox.button.openFilterAndExportPossibilities')
            : closeToolBoxButtonLabel ||
              t('datasets.toolBox.button.closeFilterAndExportPossibilities')
        }}
      </div>
      <ButtonCustom
        size="xs"
        class="hidden size-8 items-center justify-center md:flex"
        :data-test="
          toolBoxStore.visible
            ? 'desktop-close-toolBox'
            : 'desktop-open-toolBox'
        "
        @click="toolBoxStore.toggleToolboxVisibility(!toolBoxStore.visible)"
      >
        <IconStrokedArrowDown
          class="size-5 stroke-current"
          :class="{
            '-rotate-90': toolBoxStore.visible,
            'rotate-90': !toolBoxStore.visible,
          }"
        />
      </ButtonCustom>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import ButtonCustom from '../../../../components/button/ButtonCustom.vue';
import ContentAlignmentX from '../../../../components/content/ContentAlignmentX.vue';
import IconClose from '../../../../components/svg/IconClose.vue';
import IconAdd from '../../../../components/svg/IconAdd.vue';
import IconStrokedArrowDown from '../../../../components/svg/IconStrokedArrowDown.vue';
import TabButton from '../../../../components/tab/TabButton.vue';
import { useToolBoxStore } from './toolBoxStore';
import { watch } from 'vue';

const { t } = useI18n();

withDefaults(
  defineProps<{
    tabNames: string[];
    defaultIndex?: number;
    isWhite?: boolean;
    hideExpandOnDesktop?: boolean;
    openToolBoxButtonLabel?: string;
    closeToolBoxButtonLabel?: string;
  }>(),
  {
    defaultIndex: 0,
    isWhite: false,
    hideExpandOnDesktop: false,
    openToolBoxButtonLabel: '',
    closeToolBoxButtonLabel: '',
  }
);

const toolBoxStore = useToolBoxStore();
const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greater('md');

watch(mdAndLarger, (newVal) => {
  if (newVal) return;

  toolBoxStore.toggleToolboxVisibility(false);
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
