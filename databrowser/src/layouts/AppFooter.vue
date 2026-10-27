<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div class="bg-gray-50">
      <ContentAlignmentX
        class="m-auto flex flex-col p-4 text-xl xl:w-default 2xl:px-0"
      >
        <div
          class="flex w-full flex-col gap-x-10 gap-y-4 border-b border-black pb-4 font-semibold text-black lg:flex-row"
        >
          <CardContainer :no-padding="true" class="grow bg-white p-3">
            <div class="flex items-center gap-4">
              <router-link
                to="/"
                class="no-underline"
                data-test="link-to-home-page"
              >
                <div class="flex">
                  <div
                    class="h-full rounded-sm border border-black px-2 py-1 text-base leading-5 font-semibold text-black"
                    v-html="t('header.toolBadge')"
                  ></div>
                </div>
              </router-link>
              <span v-html="t('footer.cards.databrowser')"></span>
            </div>
          </CardContainer>
          <ExternalLink
            href="https://opendatahub.com/"
            tone="none"
            variant="no-underline"
            class="grow"
          >
            <CardContainer :no-padding="true" class="bg-white p-3">
              <div class="flex items-center gap-4">
                <img
                  :alt="t('header.logo')"
                  class="aspect-square h-12"
                  src="/logo-open-data-hub-black.svg"
                />
                <span v-html="t('footer.cards.openDataHub')"></span>
              </div>
            </CardContainer>
          </ExternalLink>
          <ExternalLink
            href="https://noi.bz.it/"
            tone="none"
            variant="no-underline"
            class="grow"
          >
            <CardContainer :no-padding="true" class="bg-white p-3">
              <div class="flex items-center gap-4">
                <img alt="NOI Techpark" src="/logo-noi.svg" />
                <span v-html="t('footer.cards.noi')"></span>
              </div>
            </CardContainer>
          </ExternalLink>
        </div>
        <div class="flex w-full flex-col gap-4 pt-4 md:flex-row">
          <ul class="grow basis-0">
            <li class="font-semibold">
              {{ t('footer.columns.relevantLinks.title') }}
            </li>
            <li>
              <router-link to="/dataset-overview" class="hover-underline">
                {{ t('header.menu.datasets') }}
              </router-link>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2"
                href="https://github.com/noi-techpark/odh-docs/wiki/Data-Browser"
                variant="hover-underline"
                tone="text"
              >
                {{ t('header.menu.howTo') }}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2"
                href="https://opendatahub.com/contact"
                variant="hover-underline"
                tone="text"
              >
                {{ t('header.menu.contact') }}
              </ExternalLink>
            </li>
          </ul>
          <ul class="grow basis-0">
            <li class="font-semibold">
              {{ t('footer.columns.quickstart.title') }}
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2"
                href="https://opendatahub.com"
                variant="hover-underline"
                tone="text"
              >
                {{ t('footer.columns.quickstart.openDataHubWebsite') }}
              </ExternalLink>
            </li>
            <li>
              <router-link to="/" class="hover-underline">{{
                t('footer.columns.quickstart.databrowser')
              }}</router-link>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2"
                href="https://webcomponents.opendatahub.com/"
                variant="hover-underline"
                tone="text"
              >
                {{ t('footer.columns.quickstart.webComponents') }}
              </ExternalLink>
            </li>
          </ul>
          <ul class="grow basis-0">
            <li class="font-semibold">
              {{ t('footer.columns.contributors.title') }}
            </li>
            <li>
              {{ t('footer.columns.contributors.text') }}
            </li>
            <li>
              <ExternalLink
                class="inline-flex items-center gap-2"
                href="https://opendatahub.com/community/#contributors"
                variant="hover-underline"
                tone="text"
              >
                {{ t('footer.columns.contributors.link') }}
              </ExternalLink>
            </li>
          </ul>
          <ul class="grow basis-0">
            <li class="font-semibold">
              {{ t('footer.columns.socialMedia.title') }}
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2 no-underline"
                href="https://github.com/noi-techpark"
                tone="text"
                target="_blank"
              >
                <img
                  src="/logo-github.svg"
                  :alt="t('footer.columns.socialMedia.github')"
                />{{ t('footer.columns.socialMedia.github') }}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2 no-underline"
                href="https://t.me/OpenDataHub"
                tone="text"
                target="_blank"
              >
                <img
                  src="/logo-telegram.svg"
                  :alt="t('footer.columns.socialMedia.telegram')"
                />{{ t('footer.columns.socialMedia.telegram') }}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2 no-underline"
                href="https://app.element.io/#/room/#opendatahub:matrix.org"
                tone="text"
                target="_blank"
              >
                <img
                  src="/logo-element.svg"
                  :alt="t('footer.columns.socialMedia.element')"
                />{{ t('footer.columns.socialMedia.element') }}
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                class="flex items-center gap-2 no-underline"
                href="https://www.facebook.com/opendatahub"
                tone="text"
                target="_blank"
              >
                <img
                  src="/logo-facebook.svg"
                  :alt="t('footer.columns.socialMedia.facebook')"
                />{{ t('footer.columns.socialMedia.facebook') }}
              </ExternalLink>
            </li>
          </ul>
        </div>
      </ContentAlignmentX>
    </div>
    <div>
      <ContentAlignmentX
        class="flex w-full justify-center p-4 xl:w-default 2xl:px-0"
      >
        <span class="text-sm">
          @Open Data Hub |
          <ExternalLink href="https://noi.bz.it/en/privacy" tone="text"
            >Privacy</ExternalLink
          >
        </span>
      </ContentAlignmentX>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardContainer from '../components/card/CardContainer.vue';
import ContentAlignmentX from '../components/content/ContentAlignmentX.vue';
import ExternalLink from '../components/link/ExternalLink.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.hover-underline {
  text-decoration: none;
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>
