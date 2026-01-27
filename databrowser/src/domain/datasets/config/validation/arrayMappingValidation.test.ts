// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import {
  validateArrayMapping,
  validatePropertyConfigs,
} from './arrayMappingValidation';
import { ArrayMapping, PropertyConfig } from '../types';

describe('validateArrayMapping', () => {
  it('should return no errors for valid objectMapping configuration', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      objectMapping: {
        id: 'Id',
        name: 'Name',
      },
    };

    const errors = validateArrayMapping(arrayMapping);

    expect(errors).toHaveLength(0);
  });

  it('should return no errors for valid properties configuration', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      properties: [
        {
          title: 'Name',
          component: 'StringCell',
          objectMapping: { text: 'name' },
        },
      ],
    };

    const errors = validateArrayMapping(arrayMapping);

    expect(errors).toHaveLength(0);
  });

  it('should error when both objectMapping and properties are defined', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      objectMapping: { id: 'Id' },
      properties: [
        {
          title: 'Name',
          component: 'StringCell',
          objectMapping: { text: 'name' },
        },
      ],
    };

    const errors = validateArrayMapping(arrayMapping, 'testPath');

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      severity: 'error',
    });
    expect(errors[0].path).toContain('testPath');
    expect(errors[0].path).toContain('items'); // Should include semantic path
    expect(errors[0].message).toContain('mutually exclusive');
  });

  it('should warn when properties array is empty', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      properties: [],
    };

    const errors = validateArrayMapping(arrayMapping);

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      severity: 'warning',
    });
    expect(errors[0].message).toContain('empty');
  });

  it('should error when nested property is missing required fields', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      properties: [
        {
          // Missing title and component
          objectMapping: { text: 'name' },
        } as unknown as PropertyConfig,
      ],
    };

    const errors = validateArrayMapping(arrayMapping, 'root');

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      severity: 'error',
      path: 'root.properties[0]',
    });
    expect(errors[0].message).toContain('missing required fields');
  });

  it('should recursively validate nested arrayMappings', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'roads',
      targetPropertyName: 'roads',
      properties: [
        {
          title: 'Lanes',
          component: 'EditNestedArrayCell',
          arrayMapping: {
            pathToParent: 'lanes',
            targetPropertyName: 'lanes',
            objectMapping: { id: 'Id' }, // Has objectMapping
            properties: [
              // AND properties (error!)
              {
                title: 'Width',
                component: 'StringCell',
                objectMapping: { text: 'width' },
              },
            ],
          },
        },
      ],
    };

    const errors = validateArrayMapping(arrayMapping, 'root');

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain('mutually exclusive');
    expect(errors[0].path).toContain('properties[0].arrayMapping');
  });

  it('should validate deeply nested properties', () => {
    const arrayMapping: ArrayMapping = {
      pathToParent: 'level1',
      targetPropertyName: 'level1',
      properties: [
        {
          title: 'Level 2',
          component: 'EditNestedArrayCell',
          arrayMapping: {
            pathToParent: 'level2',
            targetPropertyName: 'level2',
            properties: [
              {
                title: 'Level 3',
                component: 'EditNestedArrayCell',
                arrayMapping: {
                  pathToParent: 'level3',
                  targetPropertyName: 'level3',
                  properties: [] // Empty properties (warning)
                },
              },
            ],
          },
        },
      ],
    };

    const errors = validateArrayMapping(arrayMapping, 'root');

    expect(errors).toHaveLength(1);
    expect(errors[0].severity).toBe('warning');
    expect(errors[0].path).toContain('level3');
  });
});

describe('validatePropertyConfigs', () => {
  it('should return no errors for valid configurations', () => {
    const properties: PropertyConfig[] = [
      {
        title: 'Name',
        component: 'StringCell',
        objectMapping: { text: 'name' },
      },
      {
        title: 'Tags',
        component: 'ArrayCell',
        arrayMapping: {
          pathToParent: 'tags',
          targetPropertyName: 'tags',
        },
      },
    ];

    const errors = validatePropertyConfigs(properties);

    expect(errors).toHaveLength(0);
  });

  it('should validate all arrayMappings in property list', () => {
    const properties: PropertyConfig[] = [
      {
        title: 'Valid Property',
        component: 'StringCell',
        objectMapping: { text: 'name' },
      },
      {
        title: 'Invalid Property',
        component: 'EditNestedArrayCell',
        arrayMapping: {
          pathToParent: 'items',
          targetPropertyName: 'items',
          objectMapping: { id: 'Id' },
          properties: [
            {
              title: 'Nested',
              component: 'StringCell',
              objectMapping: { text: 'text' },
            },
          ],
        },
      },
    ];

    const errors = validatePropertyConfigs(properties, 'viewConfig');

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toContain('viewConfig[1]');
  });

  it('should handle properties without arrayMapping', () => {
    const properties: PropertyConfig[] = [
      {
        title: 'Simple Property',
        component: 'StringCell',
        objectMapping: { text: 'name' },
      },
    ];

    const errors = validatePropertyConfigs(properties);

    expect(errors).toHaveLength(0);
  });
});
