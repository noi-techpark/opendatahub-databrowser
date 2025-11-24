// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import {
  extractValueByPath,
  buildTargetFromMapping,
  buildTargetFromObjectMapping,
  buildTargetFromArrayMapping,
} from './utils';
import { PropertyConfig } from '../types';

describe('extractValueByPath', () => {
  it('should extract simple property', () => {
    const data = { name: 'John', age: 30 };
    expect(extractValueByPath(data, 'name')).toBe('John');
    expect(extractValueByPath(data, 'age')).toBe(30);
  });

  it('should extract nested property', () => {
    const data = {
      person: {
        name: 'John',
        address: {
          city: 'New York',
        },
      },
    };
    expect(extractValueByPath(data, 'person.name')).toBe('John');
    expect(extractValueByPath(data, 'person.address.city')).toBe('New York');
  });

  it('should handle escaped dots in property names', () => {
    const data = {
      'self.stations+datatypes': 'value',
    };
    expect(extractValueByPath(data, 'self\\.stations+datatypes')).toBe('value');
  });

  it('should return undefined for non-existent paths', () => {
    const data = { name: 'John' };
    expect(extractValueByPath(data, 'nonexistent')).toBeUndefined();
    expect(extractValueByPath(data, 'person.name')).toBeUndefined();
  });
});

describe('buildTargetFromObjectMapping', () => {
  it('should map object properties', () => {
    const data = { firstName: 'John', lastName: 'Doe' };
    const objectMapping = { name: 'firstName', surname: 'lastName' };

    const result = buildTargetFromObjectMapping(data, objectMapping);

    expect(result).toEqual({
      name: 'John',
      surname: 'Doe',
    });
  });

  it('should merge params into result', () => {
    const data = { title: 'Test' };
    const objectMapping = { text: 'title' };
    const params = { readonly: true, maxLength: 100 };

    const result = buildTargetFromObjectMapping(data, objectMapping, params);

    expect(result).toEqual({
      text: 'Test',
      readonly: true,
      maxLength: 100,
    });
  });

  it('should handle nested paths', () => {
    const data = {
      detail: {
        en: {
          title: 'English Title',
        },
      },
    };
    const objectMapping = { text: 'detail.en.title' };

    const result = buildTargetFromObjectMapping(data, objectMapping);

    expect(result).toEqual({
      text: 'English Title',
    });
  });
});

describe('buildTargetFromArrayMapping', () => {
  it('should return empty array for undefined data', () => {
    const arrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
    };

    const result = buildTargetFromArrayMapping(undefined, arrayMapping);

    expect(result).toEqual({ items: [] });
  });

  it('should return empty array for non-array data', () => {
    const data = { items: 'not an array' };
    const arrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
    };

    const result = buildTargetFromArrayMapping(data, arrayMapping);

    expect(result).toEqual({ items: [] });
  });

  it('should return raw array for empty objectMapping (legacy)', () => {
    const data = { tags: ['tag1', 'tag2', 'tag3'] };
    const arrayMapping = {
      pathToParent: 'tags',
      targetPropertyName: 'tags',
    };

    const result = buildTargetFromArrayMapping(data, arrayMapping);

    expect(result).toEqual({
      tags: ['tag1', 'tag2', 'tag3'],
    });
  });

  it('should map array items using objectMapping (legacy)', () => {
    const data = {
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ],
    };
    const arrayMapping = {
      pathToParent: 'users',
      targetPropertyName: 'users',
      objectMapping: {
        userId: 'id',
        userName: 'name',
      },
    };

    const result = buildTargetFromArrayMapping(data, arrayMapping);

    expect(result).toEqual({
      users: [
        { userId: 1, userName: 'John' },
        { userId: 2, userName: 'Jane' },
      ],
    });
  });

  it('should pass raw array items when properties are defined (EditNestedArrayCell)', () => {
    const data = {
      lanes: [
        { name: 'Lane 1', code: 'L1' },
        { name: 'Lane 2', code: 'L2' },
      ],
    };
    const properties: PropertyConfig[] = [
      {
        title: 'Name',
        component: 'StringCell',
        objectMapping: { text: 'name' },
      },
      {
        title: 'Code',
        component: 'StringCell',
        objectMapping: { text: 'code' },
      },
    ];
    const arrayMapping = {
      pathToParent: 'lanes',
      targetPropertyName: 'lanes',
      properties,
    };

    const result = buildTargetFromArrayMapping(data, arrayMapping);

    expect(result).toEqual({
      items: [
        { name: 'Lane 1', code: 'L1' },
        { name: 'Lane 2', code: 'L2' },
      ],
      properties,
      pathToParent: 'lanes',
    });
  });

  it('should pass parentDeprecationInfo via params for nested arrays', () => {
    const data = {
      items: [{ name: 'Item 1' }],
    };
    const properties: PropertyConfig[] = [
      {
        title: 'Name',
        component: 'StringCell',
        objectMapping: { text: 'name' },
      },
    ];
    const arrayMapping = {
      pathToParent: 'items',
      targetPropertyName: 'items',
      properties,
    };
    const params = {
      parentDeprecationInfo: [
        {
          propertyPath: 'items',
          deprecations: [{ description: 'Obsolete', pathToDeprecation: 'items' }],
        },
      ],
    };

    const result = buildTargetFromArrayMapping(data, arrayMapping, params);

    expect(result).toMatchObject({
      items: [{ name: 'Item 1' }],
      properties,
      pathToParent: 'items',
      parentDeprecationInfo: params.parentDeprecationInfo,
    });
  });
});

describe('buildTargetFromMapping', () => {
  it('should use objectMapping when both are present', () => {
    const data = { title: 'Test' };
    const propertyConfig: PropertyConfig = {
      title: 'Title',
      component: 'StringCell',
      objectMapping: { text: 'title' },
      arrayMapping: {
        pathToParent: 'items',
        targetPropertyName: 'items',
      },
    } as unknown as PropertyConfig;

    const result = buildTargetFromMapping(data, propertyConfig);

    expect(result).toEqual({ text: 'Test' });
  });

  it('should use arrayMapping when objectMapping is not present', () => {
    const data = { tags: ['a', 'b'] };
    const propertyConfig: PropertyConfig = {
      title: 'Tags',
      component: 'ArrayCell',
      arrayMapping: {
        pathToParent: 'tags',
        targetPropertyName: 'tags',
      },
    };

    const result = buildTargetFromMapping(data, propertyConfig);

    expect(result).toEqual({ tags: ['a', 'b'] });
  });

  it('should handle nested arrays with properties', () => {
    const data = {
      roads: [
        {
          name: 'Road 1',
          lanes: [
            { number: 1, width: 3.5 },
            { number: 2, width: 3.5 },
          ],
        },
      ],
    };
    const propertyConfig: PropertyConfig = {
      title: 'Roads',
      component: 'EditNestedArrayCell',
      arrayMapping: {
        pathToParent: 'roads',
        targetPropertyName: 'roads',
        properties: [
          {
            title: 'Name',
            component: 'StringCell',
            objectMapping: { text: 'name' },
          },
          {
            title: 'Lanes',
            component: 'EditNestedArrayCell',
            arrayMapping: {
              pathToParent: 'lanes',
              targetPropertyName: 'lanes',
              properties: [
                {
                  title: 'Number',
                  component: 'StringCell',
                  objectMapping: { text: 'number' },
                },
              ],
            },
          },
        ],
      },
    };

    const result = buildTargetFromMapping(data, propertyConfig);

    expect(result).toMatchObject({
      items: data.roads,
      properties: propertyConfig.arrayMapping!.properties,
      pathToParent: 'roads',
    });
  });
});
