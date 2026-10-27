<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-col gap-3">
    <span class="text-xl font-semibold lg:text-2xl">
      Partners and contributors
    </span>
    <CardText>
      The Data Browser provides all necessary information and access to Open
      Data from different fields and sources.
    </CardText>
    <div class="grid grid-cols-2 gap-3 rounded-sm lg:grid-cols-4">
      <ButtonExternalLink
        v-for="(partner, index) in partners"
        :key="index"
        :href="partner.url"
        :variant="Variant.ghost"
        class="flex items-center justify-center hover:bg-transparent focus-visible:bg-transparent"
        target="_blank"
      >
        <img
          class="h-16 rounded-sm"
          :alt="partner.imageAlt"
          :src="partner.imageSrc"
        />
      </ButtonExternalLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonExternalLink from '../button/ButtonExternalLink.vue';
import { Variant } from '../button/types';
import CardText from '../card/CardText.vue';

interface Partner {
  imageAlt: string;
  imageSrc: string;
  linkTitle: string;
  url: string;
}

const partners: Partner[] = [
  {
    imageAlt: 'Noi Techpark company logo',
    imageSrc: '/logo-noi.svg',
    linkTitle: 'NOI Techpark homepage',
    url: 'https://noi.bz.it/',
  },
  {
    imageAlt: 'studiohug company logo',
    imageSrc: '/logo-studio-hug-black.svg',
    linkTitle: 'studiohug homepage',
    url: 'https://www.studiohug.com/',
  },
  {
    imageAlt: 'Christian Gapp company logo',
    imageSrc: '/logo-gapp.svg',
    linkTitle: 'Christian Gapp homepage',
    url: 'https://gappc.net/',
  },
];
</script>
