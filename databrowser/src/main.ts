// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import CookieConsent from 'vue-cookieconsent';
import App from './App.vue';
import { consentOptions } from './cookieconsent/consentOptions';
import './cookieconsent/cookieconsent.css';
import registerCellComponents from './domain/cellComponents/plugins/registerCellComponents';
import { setupI18n } from './i18n';
import './index.css';
import { router } from './routes';
import { createHead } from '@unhead/vue/client';

const isProduction = process.env.NODE_ENV !== 'development';

const app = createApp(App);
// Enable performance measurement in development mode
app.config.performance = !isProduction;

// Add Vue router
app.use(router);

// Add pinia store
app.use(createPinia());

app.use(createHead());

// Add TanStack query client (see https://tanstack.com/query/latest)
app.use(VueQueryPlugin);

// Register Vue cell render components globally for dynamic rendering
app.use(registerCellComponents);

// Add cookie-banner
app.use(CookieConsent, consentOptions);

// Load i18n translation asynchronously
const i18nPromise = setupI18n({
  locale: 'en',
  warnHtmlMessage: false,
});

// Wait for async initialization parts to be ready before mounting the app
Promise.all([i18nPromise]).then(([i18n]) => {
  // Use translations
  app.use(i18n);

  // Mount the app
  app.mount('#app');
});