// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMetaDataStore } from '../../metaDataConfig/tourism/metaDataStore';
import { apiTypeToApiDomain } from '../../metaDataConfig/utils';
import { useOpenApi } from '../store/openApi';
import { AutocompleteGenerator } from './openApiAutocompleteGenerator';

export const useOpenApiPathSuggestion = () => {
  const { currentMetaData } = storeToRefs(useMetaDataStore());

  const apiType = currentMetaData.value?.apiType;
  const apiDomain = apiTypeToApiDomain(apiType!);

  const joinedPathSegments = `/${currentMetaData.value?.pathSegments.join('/')}`;
  const path =
    apiDomain === 'tourism' ? `${joinedPathSegments}/{id}` : joinedPathSegments;

  let generator: AutocompleteGenerator | null = null;
  if (apiDomain !== 'unknown') {
    useOpenApi()
      .loadDocument(apiDomain)
      .then((openApiSpec) => {
        generator = new AutocompleteGenerator(openApiSpec, path);
      });
  }

  const suggestions = ref<string[]>();

  const updateSuggestionTerm = (input: string) => {
    if (!generator) {
      console.error('Autocomplete generator is not initialized');
      return;
    }

    suggestions.value = generator.generateSuggestions(input);
  };

  return {
    suggestions,
    updateSuggestionTerm,
  };
};
