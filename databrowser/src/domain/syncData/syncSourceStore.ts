// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { acceptHMRUpdate, defineStore } from 'pinia';
import { useSyncSource } from './useSyncSource';
import { ref, watch } from 'vue';

interface SyncSourceBuilder {
  key: string;
  buildSyncUrl: (metaType: string, id: string) => string;
}

const resolvePlaceholders = (
  template: string,
  metaType: string,
  id: string
): string =>
  template.replace('{_Meta.Type}', metaType).replace('{Id}', id);

export const useSyncSourceStore = defineStore('syncSourceStore', () => {
  const syncSourceData = useSyncSource();

  const sources = ref<SyncSourceBuilder[]>([]);

  watch(syncSourceData.data, () => {
    if (syncSourceData.data.value == null) {
      return;
    }

    sources.value = syncSourceData.data.value.map((source) => ({
      key: source.key,
      buildSyncUrl: (metaType: string, id: string) =>
        resolvePlaceholders(source.syncDataApiUrl, metaType, id),
    }));
  });

  const hasSyncConfig = (sourceKey: string | undefined): boolean => {
    if (!sourceKey) return false;
    return sources.value.some((s) => s.key === sourceKey);
  };

  const buildSyncUrl = (
    sourceKey: string,
    metaType: string,
    id: string
  ): string | undefined => {
    const source = sources.value.find((s) => s.key === sourceKey);
    return source?.buildSyncUrl(metaType, id);
  };

  return { sources, hasSyncConfig, buildSyncUrl };
});

// Add support for hot-module-reload
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useSyncSourceStore, import.meta.hot)
  );
}
