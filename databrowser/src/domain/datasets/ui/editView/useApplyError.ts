// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AxiosError } from 'axios';
import { computed, ref, Ref, watch } from 'vue';
import { toError } from '../../../utils/convertError';
import {
  Category,
  PropertyConfigWithErrors,
  SubCategory,
} from '../category/types';

export const useApplyError = (
  categories: Ref<Category[]>,
  subcategories: Ref<SubCategory[]>,
  mutateError: Ref<Error | null>
) => {
  // Compute responseErrors from mutateError
  const responseErrors = useResponseErrors(mutateError);

  // Compute if any category has an error.If a category has an error,
  // it is marked with isAnyPropertyError: true
  const enhancedMainCategories = ref<Category[]>([]);
  watch(
    () => [responseErrors.value, categories.value],
    () => {
      const err = responseErrors.value;

      if (err == null) {
        enhancedMainCategories.value = categories.value;
        return;
      }

      const catWithErrors = categories.value.map((cat) => {
        const hasError = cat.subCategories?.some(({ properties }) =>
          properties.some((prop) => hasAnyPropertyError(prop, err.errors))
        );

        return hasError ? { ...cat, isAnyPropertyError: hasError } : { ...cat };
      });

      enhancedMainCategories.value = catWithErrors;
    },
    { immediate: true }
  );

  // Compute if any property in the current sub-category list has an error. If a property has an error,
  // it is enhanced with errors: string[], where the error messages are stored.
  const enhancedSubcategories = ref<SubCategory[]>([]);
  watch(
    () => [responseErrors.value, subcategories.value],
    () => {
      const err = responseErrors.value;

      if (err == null) {
        enhancedSubcategories.value = subcategories.value;
        return;
      }

      const subWithErrors = subcategories.value.map((sub) => {
        const properties = sub.properties.map((prop) =>
          addErrorsToProperty(prop, err.errors)
        );

        return { ...sub, properties };
      });

      enhancedSubcategories.value = subWithErrors;
    },
    { immediate: true }
  );

  // Clean errors by resetting values to default
  const cleanErrors = () => {
    enhancedMainCategories.value = categories.value;
    enhancedSubcategories.value = subcategories.value;
  };

  return {
    enhancedMainCategories,
    enhancedSubcategories,
    responseErrors,
    cleanErrors,
  };
};

// Compute responseErrors from mutateError
const useResponseErrors = (mutateError: Ref<Error | null>) => {
  return computed<{
    title: string;
    errors?: Record<string, string[]>;
  } | null>(() => {
    const err = toError(mutateError.value);

    if (err == null) {
      return null;
    }

    if (err instanceof AxiosError) {
      if (err.response == null) {
        return {
          title: err.message,
        };
      }

      const responseData = err.response.data;

      // For some cases (e.g. error during POST to create a new record),
      // there is no error object and the error message is just send as
      // plain text. That case must be handled
      if (typeof responseData === 'string') {
        return {
          title: responseData,
          errors: {
            statusCode: [`Response status code: ${err.response.status}`],
            raw: [responseData],
          },
        };
      }

      // Some backends respond with a plain object holding a single
      // "error" (singular) string message instead of the "errors" object
      // handled below, e.g. { error: "some message" }. That case must be
      // handled as well.
      const singleErrorMessage = (responseData as Record<string, unknown>)
        .error;
      if (typeof singleErrorMessage === 'string') {
        return {
          title: singleErrorMessage,
          errors: {
            statusCode: [`Response status code: ${err.response.status}`],
            raw: [singleErrorMessage],
          },
        };
      }

      // The Open Data Hub error object values can be either of type string or string[].
      // The string type values contain information like HTTP status code. Only the string[]
      // type fields contain true error messages. Those need to be returned

      const responseErrors = responseData.errors as
        | Record<string, string | string[]>
        | undefined;

      if (responseErrors == null) {
        return {
          title: `An unexpected error occurred while saving the record`,
          errors: {
            statusCode: [`Response status code: ${err.response.status}`],
          },
        };
      }

      const errors = Object.entries(responseErrors).reduce<
        Record<string, string[]>
      >((previous, [key, value]) => {
        // Return only entries whose values are of type string[] - only those contain errors
        return Array.isArray(value)
          ? { ...previous, [key]: value }
          : { ...previous };
      }, {});

      return {
        title: err.message,
        errors,
      };
    }

    return { title: err.message };
  });
};

// Check if a property has an error
const hasAnyPropertyError = (
  property: PropertyConfigWithErrors,
  errors: Record<string, string[]> | undefined
) => {
  if (errors == null) {
    return false;
  }

  const isObjectMappingError = hasObjectMappingError(
    property.objectMapping,
    errors
  );

  const isArrayMappingError = hasArrayMappingError(
    property.arrayMapping,
    errors
  );

  return isObjectMappingError || isArrayMappingError;
};

// Add errors to a property
const addErrorsToProperty = (
  property: PropertyConfigWithErrors,
  errors: Record<string, string[]> | undefined
) => {
  if (errors == null) {
    return property;
  }

  if (property.objectMapping != null) {
    const objectMappingErrorKey = findObjectMappingError(
      property.objectMapping,
      errors
    );

    return objectMappingErrorKey == undefined
      ? { ...property }
      : { ...property, errors: errors?.[objectMappingErrorKey] };
  }
  if (property.arrayMapping != null) {
    const pathToParent = property.arrayMapping.pathToParent;

    const isArrayMappingError = hasArrayMappingError(
      property.arrayMapping,
      errors
    );

    return !isArrayMappingError
      ? { ...property }
      : {
          ...property,
          errors: errors?.[pathToParent],
        };
  }
  return property;
};

const findObjectMappingError = (
  objectMapping: Record<string, string> | undefined,
  errors: Record<string, string[]>
) => {
  if (objectMapping == null || errors == null) {
    return undefined;
  }
  return Object.values(objectMapping ?? {}).find(
    (value) => errors[value] != null
  );
};

const hasObjectMappingError = (
  objectMapping: Record<string, string> | undefined,
  errors: Record<string, string[]>
) => {
  if (objectMapping == null || errors == null) {
    return false;
  }
  return findObjectMappingError(objectMapping, errors) != null;
};

const hasArrayMappingError = (
  arrayMapping: { pathToParent: string } | undefined,
  errors: Record<string, string[]>
) => {
  if (arrayMapping == null || errors == null) {
    return false;
  }
  return Object.keys(errors ?? {}).some(
    (key) => arrayMapping.pathToParent === key
  );
};
