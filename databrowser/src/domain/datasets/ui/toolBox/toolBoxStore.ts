// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import {ToolBoxSectionKey} from "@/domain/datasets/ui/toolBox/types.ts";

const initialState = {
  activeSectionKey:ToolBoxSectionKey.NONE,
  settings: {
    showAll: false,
    showDeprecated: false,
    showReferences: true,
  },
};

export const useToolBoxStore = defineStore('toolBoxStore', {
  state: () => initialState,

  actions: {
    toggleToolBoxSectionKey(sectionKey: ToolBoxSectionKey) {
      if (this.activeSectionKey === sectionKey) {
        sectionKey = ToolBoxSectionKey.NONE;
      }

      this.activeSectionKey = sectionKey;
    },
  },
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToolBoxStore, import.meta.hot));
}
