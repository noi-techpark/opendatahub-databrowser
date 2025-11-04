// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useUserSettings } from '../../../user/userSettings';

const breakpoints = useBreakpoints(breakpointsTailwind);
const mdAndLarger = breakpoints.greater('md');

// Using userSettings to persist toolbox visibility state
const userSettings = useUserSettings();

const preferredToolboxVisibility = !mdAndLarger.value
  ? 'false'
  : userSettings.getUserSetting('showToolbox');

const initialState = {
  visible:
    preferredToolboxVisibility === 'false'
      ? false
      : userSettings.getUserSetting('showToolbox'),
  settings: {
    showAll: false,
    showDeprecated: false,
    showReferences: true,
  },
};

export const useToolBoxStore = defineStore('toolBoxStore', {
  state: () => initialState,

  actions: {
    toggleToolboxVisibility(isVisible: boolean) {
      this.visible = isVisible;
      userSettings.updateUserSetting('showToolbox', isVisible);
    },
  },
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToolBoxStore, import.meta.hot));
}
