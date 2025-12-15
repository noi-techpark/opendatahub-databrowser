<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="sticky top-0 w-full">
    <div class="bg-white">
      <AlertInfo v-if="isOpen && options" :title="options.title" :content="options.content" @close="close()"/>
      <ContentAlignmentX
        class="m-auto flex flex-col gap-x-6 gap-y-2 px-4 pb-2 md:flex-row md:pb-0"
        :class="[isFullWidthNav ? 'w-full' : 'xl:w-default']"
      >
        <div class="my-2 flex items-center md:items-start">
          <InternalLink
            to="/"
            data-test="link-to-home-page"
            variant="no-underline"
          >
            <div class="flex items-stretch">
              <div
                class="h-full rounded border border-black px-2 py-0 text-lg font-bold leading-5 text-black"
                v-html="t('header.toolBadge')"
              ></div>
              <TagCustom
                v-if="envBadge"
                :type="envBadge === 'BETA' ? 'pink' : 'info'"
                :text="envBadge"
                class="h-100 ml-4 flex items-center text-sm"
              />
            </div>
          </InternalLink>
          <IconClose
            v-if="props.isMenuOpen"
            class="ml-auto md:hidden"
            @click="toggleMenu"
          />

          <div v-else class="flex items-center gap-2 md:hidden ml-auto">
            <DownloadMenu v-if="useDownloadStore().downloads.length > 0" />
            <IconMenu @click="toggleMenu" />
          </div>
        </div>

        <MenuItems
          :class="props.isMenuOpen ? '' : 'hidden'"
          class="grow border-t border-gray-250 py-1 md:flex md:border-0"
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
import AlertInfo from '@/components/alert/AlertInfo.vue';
import { useHeaderAlert } from '@/layouts/useHeaderAlert';

const { currentRoute } = useRouter();

const { t } = useI18n();

const {isOpen, options, close} = useHeaderAlert()

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
