// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later


import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import { PushDialogPayload, SyncDialogPayload } from "./types"

export const useTableViewStore = defineStore('tableViewStore',() => {
  const isPushDialogOpen = ref<boolean>(false);
  const pushDialogPayload = ref<PushDialogPayload>()
  
  const isSyncDialogOpen = ref<boolean>(false);
  const syncDialogPayload = ref<SyncDialogPayload>()

  const openPushDialog = (payload:PushDialogPayload) => {
    if (!payload || !payload.id) return
    pushDialogPayload.value = payload;
    isPushDialogOpen.value = true;
  };
  const closePushDialog = () => {
    pushDialogPayload.value = undefined;
    isPushDialogOpen.value = false;
  };

  const openSyncDialog = (payload:SyncDialogPayload) => {
    syncDialogPayload.value = payload;
    isSyncDialogOpen.value = true;
  };
  const closeSyncDialog = () => {
    syncDialogPayload.value = undefined;
    isSyncDialogOpen.value = false;
  };

  return {
    isPushDialogOpen,
    pushDialogPayload,
    isSyncDialogOpen,
    syncDialogPayload,
    openPushDialog,
    closePushDialog,
    openSyncDialog,
    closeSyncDialog
  };
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTableViewStore, import.meta.hot)
  );
}
