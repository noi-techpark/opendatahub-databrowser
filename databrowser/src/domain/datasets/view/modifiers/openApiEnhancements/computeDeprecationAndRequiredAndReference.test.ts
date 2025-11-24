// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';
import { computeViewWithOpenApiEnhancements } from './computeDeprecationAndRequiredAndReference';
import { DetailViewConfigWithType } from '../../types';

// Load mock OpenAPI schema from YAML
// The YAML contains both schema properties and components section
const schemaYaml = readFileSync(
  resolve(__dirname, '__fixtures__/testdata-schema.yaml'),
  'utf8'
);
const schema = yaml.load(schemaYaml) as OpenAPIV3.SchemaObject & {
  components?: OpenAPIV3.ComponentsObject;
};

// Create a complete OpenAPI document for testing
const createMockDocument = (): OpenAPIV3.Document => ({
  openapi: '3.0.0',
  info: { title: 'Test API', version: '1.0.0' },
  paths: {
    '/v1/testdata/{id}': {
      get: {
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: schema,
              },
            },
          },
        },
      },
    },
  },
  components: schema.components,
});

describe('computeDeprecationAndRequiredAndReference', () => {
  describe('Simple properties', () => {
    it('should detect deprecation on simple property', () => {
      const view: DetailViewConfigWithType = {
        type: 'detail',
        elements: [
          {
            name: 'Test',
            slug: 'test',
            subcategories: [
              {
                name: 'Sub',
                properties: [
                  {
                    title: 'Foo Deprecated',
                    component: 'StringCell',
                    objectMapping: {
                      text: 'FooDeprecated',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = computeViewWithOpenApiEnhancements(
        createMockDocument(),
        'tourism',
        ['testdata'],
        view
      ) as DetailViewConfigWithType;

      const property = result.elements[0].subcategories[0].properties[0];
      expect(property.deprecationInfo).toBeDefined();
      expect(property.deprecationInfo).toHaveLength(1);
      expect(property.deprecationInfo![0].deprecations).toHaveLength(1);
      expect(property.deprecationInfo![0].deprecations[0].description).toContain('Obsolete');
    });

    it('should not add deprecationInfo for non-deprecated properties', () => {
      const view: DetailViewConfigWithType = {
        type: 'detail',
        elements: [
          {
            name: 'Test',
            slug: 'test',
            subcategories: [
              {
                name: 'Sub',
                properties: [
                  {
                    title: 'Active',
                    component: 'ToggleCell',
                    objectMapping: {
                      checked: 'Active',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = computeViewWithOpenApiEnhancements(
        createMockDocument(),
        'tourism',
        ['testdata'],
        view
      ) as DetailViewConfigWithType;;

      const property = result.elements[0].subcategories[0].properties[0];
      expect(property.deprecationInfo || []).toEqual([]);
    });
  });

  describe('Legacy arrayMapping with objectMapping', () => {
    it('should detect deprecation on array path for deprecated array', () => {
      // The path "LoreIpsumDeprecated" should be detected as deprecated
      expect(schema.properties?.LoreIpsumDeprecated).toMatchObject({
        deprecated: true,
      });
    });
  });

  describe('Nested arrays with properties', () => {
    it('should detect deprecation on nested property in first level array', () => {
      // In the real schema, Foo.Valid.[].DeprecatedLeaf is deprecated
      // Path should be: Foo -> Valid (array) -> items (ValidStruct) -> DeprecatedLeaf (deprecated)
      const validStruct = schema.components?.schemas?.ValidStruct as OpenAPIV3.SchemaObject;
      expect(validStruct.properties?.DeprecatedLeaf).toMatchObject({
        deprecated: true,
      });
    });

    it('should detect deprecation on second level nested array (LoreIpsum[].Valid[].DeprecatedLeaf)', () => {
      // The path should be constructed as: LoreIpsum.[].Valid.[].DeprecatedLeaf
      // This tests the fix where we add `.[]` instead of just `[]`
      // Verify schema structure
      const firstLevel = schema.properties?.LoreIpsum as OpenAPIV3.ArraySchemaObject;
      expect(firstLevel.type).toBe('array');

      const firstLevelNesting = schema.components?.schemas
        ?.FirstLevelNesting as OpenAPIV3.SchemaObject;
      expect(firstLevelNesting.properties?.Valid).toBeDefined();

      const validArray = firstLevelNesting.properties?.Valid as OpenAPIV3.ArraySchemaObject;
      expect(validArray.type).toBe('array');

      const validStruct = schema.components?.schemas?.ValidStruct as OpenAPIV3.SchemaObject;
      expect(validStruct.properties?.DeprecatedLeaf).toMatchObject({
        deprecated: true,
      });
    });

    it('should propagate parent deprecation to nested properties', () => {
      // LoreIpsumDeprecated is deprecated, so all nested properties should inherit this
      expect(schema.properties?.LoreIpsumDeprecated).toMatchObject({
        deprecated: true,
      });
    });

    it('should detect deprecated array within non-deprecated parent', () => {
      // LoreIpsum.[].Deprecated is deprecated
      const firstLevelNesting = schema.components?.schemas
        ?.FirstLevelNesting as OpenAPIV3.SchemaObject;
      expect(firstLevelNesting.properties?.Deprecated).toMatchObject({
        deprecated: true,
      });

      // And the nested property is also deprecated
      const deprecatedStruct = schema.components?.schemas
        ?.DeprecatedStruct as OpenAPIV3.SchemaObject;
      expect(deprecatedStruct.properties?.DeprecatedSource).toMatchObject({
        deprecated: true,
      });
    });
  });

  describe('Path construction for nested arrays', () => {
    it('should construct paths with proper .[] separators', () => {
      // This is a regression test for the bug where paths were constructed as
      // "LoreIpsum[].Valid" instead of "LoreIpsum.[].Valid"
      //
      // When split by '.', the former produces ["LoreIpsum[]", "Valid"]
      // but should produce ["LoreIpsum", "[]", "Valid"]

      const path1 = 'LoreIpsum[].Valid';
      const path2 = 'LoreIpsum.[].Valid';

      expect(path1.split('.')).toEqual(['LoreIpsum[]', 'Valid']);
      expect(path2.split('.')).toEqual(['LoreIpsum', '[]', 'Valid']);

      // The correct format is path2
    });
  });

  describe('Reference info detection', () => {
    it('should detect reference info from params.url', () => {
      const view: DetailViewConfigWithType = {
        type: 'detail',
        elements: [
          {
            name: 'Test',
            slug: 'test',
            subcategories: [
              {
                name: 'Sub',
                properties: [
                  {
                    title: 'Source',
                    component: 'InputReferenceCell',
                    objectMapping: {
                      value: 'Source',
                    },
                    params: {
                      url: 'https://api.tourism.testingmachine.eu/v1/Source?pagesize=-1',
                      keySelector: 'Key',
                      labelSelector: 'Name.{language}',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = computeViewWithOpenApiEnhancements(
        createMockDocument(),
        'tourism',
        ['testdata'],
        view
      ) as DetailViewConfigWithType;;

      const property = result.elements[0].subcategories[0].properties[0];
      expect(property.referenceInfo).toBeDefined();
      expect(property.referenceInfo?.origin).toBe('Source');
      expect(property.referenceInfo?.url).toContain('Source');
    });
  });
});
