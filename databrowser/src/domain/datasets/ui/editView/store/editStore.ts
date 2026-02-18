// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import * as R from 'ramda';
import { markRaw } from 'vue';
import { EditData, initialState } from './initialState';
import { PropertyUpdate,EditStoreAction } from './types';

export const useEditStore = defineStore('editStore', {
  state: () => initialState,
  getters: {
    isDuplicateAction(state) {
      return (state.action === 'duplicate');
    },
    initialAsJson(state) {
      return JSON.stringify(state.initial, null, 2);
    },
    currentAsJson(state) {
      return JSON.stringify(state.current, null, 2);
    },
    isEqual(state) {
      return R.equals(state.initial, state.current);
    },
  },
  actions: {
    setAction(action: EditStoreAction | null) {
      this.action = action;
    },
    setInitial(initial: EditData) {
      this.initial = markRaw(initial);
    },
    setCurrent(next: EditData) {
      this.current = markRaw(next);
    },
    updateProperties(update: PropertyUpdate) {
      const updates = Array.isArray(update) ? update : [update];
      const next = updates.reduce<EditData>((previous, { prop, value }) => {
        const path = prop.split('.');
        return R.assocPath(path, value, previous);
      }, this.current);
      this.setCurrent(markRaw(next));
    },
  },
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEditStore, import.meta.hot));
}
