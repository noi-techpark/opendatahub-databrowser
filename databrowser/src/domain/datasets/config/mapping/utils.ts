// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as R from 'ramda';
import {
  ArrayMapping,
  ObjectMapping,
  PropertyConfig,
  TargetPropertyName,
} from '../types';

// Split path by "." but not if the "." is escaped by a backslash
// This is useful for paths like "self.stations+datatypes+measurements"
// in the mobility domain, where the "." is not always a separator but
// sometimes part of the property name, e.g. "self.stations+datatypes"
const regexPathSplit = /(?<!\\)\./;
const regexDoubleSlashes = /\\/g;

export const extractValueByPath = (data: unknown, path: string) => {
  const pathAsArray = path
    .split(regexPathSplit)
    .map((p) => p.replace(regexDoubleSlashes, ''));
  const lensePath = R.lensPath(pathAsArray);
  return R.view(lensePath, data);
};

export const buildTargetFromMapping = (
  data: unknown,
  propertyConfig: PropertyConfig,
  params?: Record<string, unknown>
) =>
  propertyConfig.objectMapping != null
    ? buildTargetFromObjectMapping(data, propertyConfig.objectMapping, params)
    : buildTargetFromArrayMapping(data, propertyConfig.arrayMapping, params);

export const buildTargetFromObjectMapping = (
  data: unknown,
  objectMapping: ObjectMapping | undefined,
  params?: Record<string, unknown>
) => {
  if (objectMapping == null) {
    return { ...params };
  }

  const extractedFields = Object.keys(objectMapping).reduce<
    Record<TargetPropertyName, unknown>
  >((prev, key) => {
    const property = objectMapping[key];
    const value = extractValueByPath(data, property);
    return { ...prev, [key]: value };
  }, {});

  return { ...extractedFields, ...params };
};

export const buildTargetFromArrayMapping = (
  data: unknown,
  arrayMapping: ArrayMapping,
  params?: Record<string, unknown>
) => {
  const { pathToParent, objectMapping, properties, targetPropertyName } = arrayMapping;

  // Return object has a property whose name is the value of the "targetPropertyName" variable
  // e.g. value of "targetPropertyName" is "abcdefg", then the result object will have a property "abcdefg"
  const defaultResult = { [targetPropertyName]: [], ...params };

  // Get array from input data
  const dataArray = extractValueByPath(data, pathToParent);

  // If data is not an array, return default result
  if (dataArray == null || !Array.isArray(dataArray)) {
    return defaultResult;
  }

  // NEW: If properties are defined, pass raw array items to EditNestedArrayCell
  // The component will handle rendering each property for each item
  // Note: Use "items" as the key (not targetPropertyName) because EditNestedArrayCell expects it
  if (properties != null && properties.length > 0) {
    return {
      items: dataArray,
      properties: properties,  // Pass property configs to the component
      pathToParent: pathToParent,  // Pass pathToParent for update propagation
      ...params,
    };
  }

  // LEGACY: If object mapping is undefined or empty, then the object defined by parentPath
  // is returned as it is. This is useful e.g. for an array of simple types
  // (strings, numbers or booleans)
  if (isObjectMappingEmpty(objectMapping)) {
    return { ...defaultResult, [targetPropertyName]: dataArray };
  }

  // LEGACY: For each entry in the array, build target objects as defined by the object mapping
  const arrayOfTargetObjects = dataArray.map((item) => {
    return buildTargetFromObjectMapping(item, objectMapping);
  });

  return { ...defaultResult, [targetPropertyName]: arrayOfTargetObjects };
};

export const isObjectMappingEmpty = (
  objectMapping?: ObjectMapping
): objectMapping is undefined =>
  objectMapping == null || Object.keys(objectMapping).length === 0;
