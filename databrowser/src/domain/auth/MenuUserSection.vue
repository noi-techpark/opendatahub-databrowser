<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="auth.isAuthenticated">
    <!-- Mobile view -->
    <div class="flex flex-col items-start gap-y-4 md:hidden">
      <HeaderExternalLink :href="profileUrl" data-test="user-profile-link">
        {{ t('auth.profile') }}
      </HeaderExternalLink>
      <HeaderButton data-test="user-profile-logout" @click="onLogout">
        {{ t('auth.logout') }}
      </HeaderButton>
    </div>
    <!-- Desktop view -->
    <PopoverCustom class="hidden md:flex">
      <template #trigger>
        <PopoverCustomButton class="rounded focus-visible:outline-offset-2">
          <ProfileButton :username="auth.user?.name" />
        </PopoverCustomButton>
      </template>
      <template #container>
        <PopoverCustomPanel class="mt-1 w-56" :has-close-button="false">
          <ExternalLink
            :href="profileUrl"
            data-test="user-profile-link"
            tone="text"
            variant="no-underline"
            class="flex w-full p-4 hover:bg-gray-50"
          >
            {{ t('auth.profile') }}
          </ExternalLink>
          <PopoverContentDivider />
          <button
            class="flex w-full rounded p-4 hover:bg-gray-50 focus-visible:outline-offset-2"
            data-test="user-profile-logout"
            @click="onLogout"
          >
            {{ t('auth.logout') }}
          </button>
        </PopoverCustomPanel>
      </template>
    </PopoverCustom>
  </div>
  <div
    v-else
    class="flex flex-col items-start gap-x-5 gap-y-4 md:flex-row md:items-center"
  >
    <HeaderButton class="md:hidden" @click="onLogin">{{
      t('auth.login')
    }}</HeaderButton>
    <HeaderButton class="md:hidden" @click="onRegister">{{
      t('auth.register')
    }}</HeaderButton>
    <PopoverCustom class="hidden h-8 md:flex">
      <template #trigger>
        <PopoverCustomButton class="rounded focus-visible:outline-offset-2">
          <ProfileButton />
        </PopoverCustomButton>
      </template>
      <template #container>
        <PopoverCustomPanel class="mt-1 w-56" :has-close-button="false">
          <button
            class="flex w-full rounded p-4 hover:bg-gray-50 focus-visible:outline-offset-2"
            @click="onLogin"
          >
            {{ t('auth.login') }}
          </button>
          <PopoverContentDivider />
          <button
            class="flex w-full rounded p-4 hover:bg-gray-50 focus-visible:outline-offset-2"
            @click="onRegister"
          >
            {{ t('auth.register') }}
          </button>
        </PopoverCustomPanel>
      </template>
    </PopoverCustom>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import HeaderButton from '../../components/header/HeaderButton.vue';
import HeaderExternalLink from '../../components/header/HeaderExternalLink.vue';
import ExternalLink from '../../components/link/ExternalLink.vue';
import PopoverContentDivider from '../../components/popover/PopoverContentDivider.vue';
import PopoverCustom from '../../components/popover/PopoverCustom.vue';
import PopoverCustomButton from '../../components/popover/PopoverCustomButton.vue';
import PopoverCustomPanel from '../../components/popover/PopoverCustomPanel.vue';
import { keycloak } from './keycloak';
import ProfileButton from './ProfileButton.vue';
import { useAuth } from './store/auth';

const { t } = useI18n();

const auth = useAuth();

keycloak.onAuthSuccess = () => {
  auth.authenticate(keycloak.token);
};

keycloak.onAuthError = () => {
  auth.unauthenticate();
};

keycloak.onAuthRefreshSuccess = () => {
  auth.authenticate(keycloak.token);
};

keycloak.onAuthRefreshError = () => {
  auth.unauthenticate();
};

keycloak.onReady = () => {
  auth.ready = true;
};

function onLogin() {
  keycloak.login();
}

function onRegister() {
  keycloak.register();
}

function onLogout() {
  keycloak.logout();
}

const profileUrl = keycloak.createAccountUrl();
</script>
