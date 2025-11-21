// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ArrayMapping, PropertyConfig } from '../types';

/**
 * Validation errors for ArrayMapping configurations
 */
export interface ArrayMappingValidationError {
  message: string;
  path: string;
  severity: 'error' | 'warning';
}

/**
 * Validates an ArrayMapping configuration
 * Returns an array of validation errors (empty if valid)
 */
export const validateArrayMapping = (
  arrayMapping: ArrayMapping,
  propertyPath: string = ''
): ArrayMappingValidationError[] => {
  const errors: ArrayMappingValidationError[] = [];

  // Check mutual exclusivity of objectMapping and properties
  if (arrayMapping.objectMapping != null && arrayMapping.properties != null) {
    errors.push({
      message: `ArrayMapping cannot have both objectMapping and properties defined. They are mutually exclusive. Use objectMapping for simple flat mapping, or properties for nested component rendering. Found: objectMapping=${JSON.stringify(arrayMapping.objectMapping)}, properties.length=${arrayMapping.properties.length}`,
      path: propertyPath,
      severity: 'error',
    });
  }

  // Validate that properties array is not empty if defined
  if (arrayMapping.properties != null && arrayMapping.properties.length === 0) {
    errors.push({
      message: 'ArrayMapping.properties is defined but empty. Either provide property configurations or use objectMapping instead.',
      path: propertyPath,
      severity: 'warning',
    });
  }

  // Recursively validate nested properties
  if (arrayMapping.properties != null) {
    arrayMapping.properties.forEach((property, index) => {
      const nestedPath = `${propertyPath}.properties[${index}]`;

      // Validate nested property has required fields
      if (!property.title || !property.component) {
        errors.push({
          message: `Property at ${nestedPath} is missing required fields (title or component)`,
          path: nestedPath,
          severity: 'error',
        });
      }

      // Recursively validate nested arrayMappings
      if (property.arrayMapping) {
        const nestedErrors = validateArrayMapping(
          property.arrayMapping,
          `${nestedPath}.arrayMapping`
        );
        errors.push(...nestedErrors);
      }
    });
  }

  return errors;
};

/**
 * Validates all PropertyConfig entries in a configuration
 * Useful for validating entire view configurations
 */
export const validatePropertyConfigs = (
  properties: PropertyConfig[],
  configPath: string = ''
): ArrayMappingValidationError[] => {
  const errors: ArrayMappingValidationError[] = [];

  properties.forEach((property, index) => {
    if (property.arrayMapping) {
      const propertyPath = `${configPath}[${index}]`;
      const validationErrors = validateArrayMapping(
        property.arrayMapping,
        `${propertyPath}.arrayMapping`
      );
      errors.push(...validationErrors);
    }
  });

  return errors;
};

/**
 * Logs validation errors to console
 * Useful during development to catch configuration issues early
 */
export const logValidationErrors = (
  errors: ArrayMappingValidationError[],
  configName: string
) => {
  if (errors.length === 0) return;

  console.group(`⚠️ Configuration validation errors in ${configName}`);
  errors.forEach((error) => {
    const logFn = error.severity === 'error' ? console.error : console.warn;
    logFn(`[${error.severity.toUpperCase()}] ${error.path}: ${error.message}`);
  });
  console.groupEnd();
};
