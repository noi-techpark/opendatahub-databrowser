// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useDebounceFn } from '@vueuse/core';
import * as R from 'ramda';
import { Ref } from 'vue';
import { isObjectMappingEmpty } from '../../domain/datasets/config/mapping/utils';
import {
  ArrayMapping,
  ObjectMapping,
} from '../../domain/datasets/config/types';
import { useEditStore } from '../../domain/datasets/ui/editView/store/editStore';
import { EditData } from '../../domain/datasets/ui/editView/store/initialState';
import {
  PropertyUpdate,
  PropertyValue,
} from '../../domain/datasets/ui/editView/store/types';

export const useUpdate = (
  tagName: Ref<string>,
  objectMapping: Ref<ObjectMapping | undefined>,
  arrayMapping: Ref<ArrayMapping | undefined>
) => {
  const editStore = useEditStore();

  const computeObjectValueUpdates = (
    updates: PropertyValue[],
    objectMapping: ObjectMapping
  ) => {
    return updates
      .map(({ prop, value }) => {
        // Get property name, e.g. Shortname
        const targetPropertyName = objectMapping[prop];

        // If target property is unknown, log error and return undefined
        if (targetPropertyName == null) {
          logUnknownProperty(prop, tagName.value, objectMapping);
          return;
        }

        console.debug(
          `Change for ${tagName.value}: prop "${prop}" becomes "${value}" for property ${targetPropertyName}`
        );

        return { prop: targetPropertyName, value };
      })
      .filter((entry): entry is PropertyValue => entry != null);
  };

  const computeArrayValueUpdates = (
    updates: PropertyValue[],
    { pathToParent, objectMapping, properties }: ArrayMapping
  ) => {
    // NEW: If properties are defined, EditNestedArrayCell handles all update logic
    // The component already merges updates into array items preserving other fields
    // Just pass through the value directly
    if (properties != null && properties.length > 0) {
      return {
        prop: pathToParent,
        value: updates[0].value,
      };
    }

    // LEGACY: If object mappings is undefined or empty, then the data consists
    // of an array of simple types (strings, number or booleans). We can
    // return it as it is
    if (isObjectMappingEmpty(objectMapping)) {
      return {
        prop: pathToParent,
        value: updates[0].value,
      };
    }

    // LEGACY: Compute path to parent as array for later on usage
    const pathToParentAsArray = pathToParent.split('.');

    // Get array of entries to update from input data
    const entries = updates[0].value as Record<string, unknown>[];

    // Map array entries
    const mappedDataArray = entries.map((entry, index) => {
      // Get current element value from store to be merged with incoming value.
      // This is necessary to not lose data that is not part of the incoming value
      // e.g. data in other languages
      const currentValue = getCurrentValue(
        editStore.current,
        pathToParentAsArray,
        index
      );

      // Merge the properties for the current entry
      return Object.entries(entry).reduce<Record<string, unknown>>(
        (prev, [key, value]) => {
          // Get property name, e.g. ImageTitle.en
          const targetPropertyName = objectMapping[key];
          
          // If target property is unknown, log error and return previous value
          if (targetPropertyName == null) {
            logUnknownProperty(key, tagName.value, objectMapping);
            return prev;
          }

          // Compute path for data assignment
          const path = targetPropertyName.split('.');

          // Assign data to path
          return R.assocPath(path, value, prev);
        },
        currentValue
      );
    });

    return {
      prop: pathToParent,
      value: mappedDataArray,
    };
  };

  return useDebounceFn((update: PropertyUpdate) => {
    const updates = Array.isArray(update) ? update : [update];

    if (objectMapping.value != null) {
      const objectValueUpdates = computeObjectValueUpdates(
        updates,
        objectMapping.value
      );

      editStore.updateProperties(objectValueUpdates);
    }

    if (arrayMapping.value != null) {
      const listValueUpdates = computeArrayValueUpdates(
        updates,
        arrayMapping.value
      );
      editStore.updateProperties(listValueUpdates);
    }
  }, 200);
};

const logUnknownProperty = (
  prop: string,
  tagName: string,
  objectMapping: ObjectMapping
) => {
  const knownProperties =
    objectMapping == null ? 'none' : JSON.stringify(objectMapping);
  const message = `Got update event from component ${tagName} for property "${prop}" but no property with that name could be found (known properties: ${knownProperties})`;
  console.log(message);
};

const getCurrentValue = (current: EditData, path: string[], index: number) => {
  const lensePath = R.lensPath(path);
  const parent = R.view(lensePath, current);
  return parent?.at(index) ?? {};
};
