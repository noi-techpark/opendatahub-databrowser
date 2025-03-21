// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

import vue from '@vitejs/plugin-vue';
import dns from 'dns';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  server: {
    port: 3000,
  },
  plugins: [
    vue(),
    // TODO: Check if the setting below is necessary, it seems to work also without it,
    // no warnings are shown in developer console
    // See https://v3.vuejs.org/guide/web-components.html#using-custom-elements-in-vue
    // vue({
    //   template: {
    //     compilerOptions: {
    //       // treat all tags with a dash as custom elements
    //       isCustomElement: (tag) => tag.includes('databrowser-'),
    //     },
    //   },
    // }),
  ],
});
