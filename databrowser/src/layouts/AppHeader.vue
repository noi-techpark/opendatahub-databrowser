<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="sticky top-0 z-[999] w-full">
    <div class="bg-white">
      <ContentAlignmentX
        class="m-auto flex flex-col gap-x-12 gap-y-2 px-4 pb-2 md:flex-row md:pb-0"
        :class="[isFullWidthNav ? 'w-full' : 'xl:w-default']"
      >
        <div class="flex items-center justify-between gap-2 md:items-start">
          <InternalLink
            to="/"
            data-test="link-to-home-page"
            variant="no-underline"
          >
            <div class="flex">
              <div
                class="h-full rounded-b border-x border-b border-black px-2 py-1 text-base font-semibold leading-5 text-black"
                v-html="t('header.toolBadge')"
              ></div>
              <div class="hidden h-min md:block">
                <TagCustom
                  v-if="envBadge"
                  :type="envBadge === 'BETA' ? 'pink' : 'info'"
                  :text="envBadge"
                  class="rounded-none text-sm"
                />
              </div>
            </div>
          </InternalLink>

          <IconClose
            v-if="props.isMenuOpen"
            class="ml-auto md:hidden"
            @click="toggleMenu"
          />

          <div v-else class="flex items-center gap-2 md:hidden">
            <DownloadMenu v-if="useDownloadStore().downloads.length > 0" />
            <IconMenu @click="toggleMenu" />
          </div>
        </div>

        <MenuItems
          :class="props.isMenuOpen ? '' : 'hidden'"
          class="grow border-t border-gray-250 pb-4 pt-2 md:flex md:border-0"
        />
      </ContentAlignmentX>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import ContentAlignmentX from '../components/content/ContentAlignmentX.vue';
import DownloadMenu from '../components/download/DownloadMenu.vue';
import InternalLink from '../components/link/InternalLink.vue';
import IconClose from '../components/svg/IconClose.vue';
import IconMenu from '../components/svg/IconMenu.vue';
import TagCustom from '../components/tag/TagCustom.vue';
import { useDownloadStore } from '../domain/download/downloadStore';
import MenuItems from './menu/MenuItems.vue';

const { currentRoute } = useRouter();

const { t } = useI18n();

const props = defineProps<{
  isMenuOpen: boolean;
}>();

const emit = defineEmits<{
  toggleMenu: [boolean];
}>();

const envBadge = import.meta.env.VITE_APP_ENV_BADGE;

const isFullWidthNav = computed(() => {
  return currentRoute.value.path.startsWith('/dataset/');
});

function toggleMenu() {
  emit('toggleMenu', !props.isMenuOpen);
}
</script>
