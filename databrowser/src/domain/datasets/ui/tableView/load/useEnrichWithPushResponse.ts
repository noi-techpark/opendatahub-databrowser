// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, ref, watch, toValue,MaybeRefOrGetter } from 'vue';
import { axiosWithMaybeAuth } from '@/domain/api/apiAuth';


type AnyRow = Record<string, unknown>;

export const useEnrichWithPushResponse = (
  pushResponseFullPath: MaybeRefOrGetter<string | undefined>,
  baseRows: MaybeRefOrGetter<unknown[] | undefined>,
  options?: {
    merge?: (base: AnyRow, extra: AnyRow) => AnyRow;
    enabled?: MaybeRefOrGetter<boolean | null | undefined>;
  }
) => {
  const mergeFn = options?.merge ?? ((base: AnyRow, extra: AnyRow) => ({ ...base, ...extra }));

  const pushData = ref<AnyRow[] | undefined>(undefined);
  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref<unknown>(null);

  const asArray = (v: unknown): AnyRow[] => (Array.isArray(v) ? (v as AnyRow[]) : []);

  const objectIds = computed(() => {
    const rows = asArray(toValue(baseRows));
    return rows
      .map((r) => r?.Id)
      .filter((x): x is string => typeof x === 'string' && x.length > 0);
  });

  const body = computed(() => {
    if (objectIds.value.length === 0) return null;
    return { objectidlist: objectIds.value.join(',') };
  });

  const canFetch = computed(() => {
    const enabled = toValue(options?.enabled);
    if (enabled === false) return false;
    return !!toValue(pushResponseFullPath) && !!body.value;
  });

  const firedKey = ref<string>('');
  watch(
    () => ({
      can: canFetch.value,
      url: toValue(pushResponseFullPath) ?? '',
      ids: body.value?.objectidlist ?? '',
    }),
    ({ can, url, ids }) => {
      if (!can) return;
      const key = `${url}::${ids}`;
      if (!ids || !url) return;
      if (firedKey.value === key) return;
      firedKey.value = key;
      void doFetch();
    },
    { immediate: false, flush: 'post' }
  );


  const doFetch = async () => {
    if (!canFetch.value) {
      pushData.value = undefined;
      return;
    }

    isLoading.value = true;
    isError.value = false;
    error.value = null;

    try {
      const url = toValue(pushResponseFullPath);
      if (!url) {
        pushData.value = undefined;
        return;
      }
      const axiosInstance = await axiosWithMaybeAuth(
        true,
        undefined
      );
      const responseData = await axiosInstance
        .post(url, body.value)
        .then((r) => r.data);
      pushData.value = responseData?.Items ?? responseData?.data ?? responseData;
    } catch (e) {
      isError.value = true;
      error.value = e;
      pushData.value = undefined;
    } finally {
      isLoading.value = false;
    }
  };

  const pushMap = computed(() => {
    const rawData = (pushData.value ?? []) as AnyRow[];
    const dataMap = new Map<string, AnyRow>();

    for (const row of rawData) {
      const pushObject = row?.PushObject as Record<string, unknown>;
      if (!pushObject || !pushObject.Id) continue;
      const key = String(pushObject.Id).trim();
      if (!key) continue;

      if (!dataMap.has(key)) {
        dataMap.set(key, row);
      }
    }

    return dataMap;
  });


  const mergedData = computed(() => {
    const base = asArray(toValue(baseRows));
    const map = pushMap.value;

    return base.map((row) => {
      if (!row?.Id){
        return row;
      }
      const id: string = String(row.Id);
      const extra = map.get(id);
      return extra ? mergeFn(row, extra) : row;
    });
  });

  return {
    mergedData,
    isLoading,
    isError,
    error,
    refetch: doFetch,
    pushData, // raw data if needed
  };
};
