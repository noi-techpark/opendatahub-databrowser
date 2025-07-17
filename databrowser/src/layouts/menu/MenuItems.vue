<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="z-10 flex flex-col items-start justify-between gap-y-8 md:flex-row md:items-center"
  >
    <div
      class="flex h-full flex-col items-start gap-x-12 gap-y-4 text-lg text-gray-900 md:h-8 md:flex-row md:items-center"
    >
      <HeaderLink to="/about">
        {{ t('header.menu.about') }}
      </HeaderLink>
      <HeaderExternalLink
        href="https://github.com/noi-techpark/odh-docs/wiki/Data-Browser"
      >
        {{ t('header.menu.howTo') }}
      </HeaderExternalLink>
      <HeaderExternalLink href="https://opendatahub.com/contact">
        {{ t('header.menu.contact') }}
      </HeaderExternalLink>
    </div>

    <div
      class="flex grow flex-col gap-x-2 gap-y-4 pt-1 md:grow-0 md:flex-row md:items-center"
    >
      <DownloadMenu
        v-if="useDownloadStore().downloads.length > 0"
        class="hidden md:flex"
        :width-classes="['md:w-[300px]']"
      />

      <MenuUserSection />

      <ExternalLink
        href="https://opendatahub.com"
        variant="no-underline"
        tone="text"
      >
        <img
          :alt="t('header.logo')"
          class="mt-2 aspect-square h-8 md:mt-0 md:h-6"
          src="/logo-open-data-hub-black.svg"
        />
      </ExternalLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import DownloadMenu from '../../components/download/DownloadMenu.vue';
import HeaderExternalLink from '../../components/header/HeaderExternalLink.vue';
import HeaderLink from '../../components/header/HeaderLink.vue';
import ExternalLink from '../../components/link/ExternalLink.vue';
import MenuUserSection from '../../domain/auth/MenuUserSection.vue';
import { useDownloadStore } from '../../domain/download/downloadStore';

const { t } = useI18n();
</script>
