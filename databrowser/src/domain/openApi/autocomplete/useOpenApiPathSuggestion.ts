// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref } from 'vue';
import { useMetaDataStore } from '../../metaDataConfig/tourism/metaDataStore';
import { useOpenApi } from '../store/openApi';
import { AutocompleteGenerator } from './openApiAutocompleteGenerator';

export const useOpenApiPathSuggestion = () => {
  const path = `/${useMetaDataStore().currentMetaData?.pathSegments.join('/')}/{id}`;

  let generator: AutocompleteGenerator | null = null;
  useOpenApi()
    .loadDocument('tourism')
    .then((openApiSpec) => {
      generator = new AutocompleteGenerator(openApiSpec, path);
    });

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
