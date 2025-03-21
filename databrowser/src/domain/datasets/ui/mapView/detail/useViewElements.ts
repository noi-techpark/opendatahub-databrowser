// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computedAsync } from '@vueuse/core';
import { computed, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { KnownApiType } from '../../../../metaDataConfig/types';
import { loadDatasetConfig } from '../../../config/load/datasetConfigLoader';
import { useObjectValueReplacer } from '../../../config/mapping/objectValueReplacer';
import { useStringReplacer } from '../../../config/mapping/stringReplacer';
import { DatasetConfig, PropertyConfig } from '../../../config/types';
import { defaultLanguage } from '../../../language';
import { stringifyRouteQuery } from '../../../location/stringifyQuery';
import { computeDynamicParamsReplacement } from '../../../view/modifiers/dynamicParams/dynamicParamsReplacement';
import { extractView } from '../../../view/modifiers/extractView/ViewKey';
import { ListViewConfigWithType } from '../../../view/types';

export const useViewElements = (
  apiType: Ref<KnownApiType | undefined>,
  recordUrl: Ref<string | undefined>
) => {
  const router = useRouter();
  const language = computed(() => {
    return stringifyRouteQuery({
      language: router.currentRoute.value.query.language ?? defaultLanguage,
    });
  });
  const stringReplacer = useStringReplacer(language);
  const objectValueReplacer = useObjectValueReplacer(stringReplacer);

  const config = computedAsync<DatasetConfig | undefined>(async () => {
    if (apiType.value == null || recordUrl.value == null) {
      return;
    }

    if (apiType.value === 'content') {
      const { pathname } = new URL(recordUrl.value);
      const path = pathname.split('/').filter((part) => part.length > 0);
      // Remove the last part, which is the record ID
      path.pop();
      return await loadDatasetConfig('embedded', 'tourism', path);
    }

    if (apiType.value === 'timeseries') {
      const { pathname } = new URL(recordUrl.value);
      const path = pathname.split('/').filter((part) => part.length > 0);
      return await loadDatasetConfig('embedded', 'mobility', path);
    }
  });

  const viewElements = computed<PropertyConfig[]>(() => {
    if (config.value == null) {
      return [];
    }

    if (apiType.value === 'content') {
      const viewFromDatasetConfig = extractView(config.value?.views, 'table');
      const replacedParams = computeDynamicParamsReplacement(
        'tourism',
        viewFromDatasetConfig,
        stringReplacer.value,
        objectValueReplacer.value
      ) as ListViewConfigWithType;

      return replacedParams.elements ?? [];
    }

    if (apiType.value === 'timeseries') {
      return config.value?.views?.table?.elements ?? [];
    }

    return [];
  });

  return { viewElements };
};
