// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { computeDynamicParamsReplacement } from './dynamicParamsReplacement';
import { DetailViewConfigWithType } from '../../types';

describe('dynamicParamsReplacement', () => {
  const stringReplacer = (str: string) => str.replace('{language}', 'en');
  const objectValueReplacer = (obj?: Record<string, string>): Record<string, string> => {
    if (!obj) return {};
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = stringReplacer(value);
    }
    return result;
  };

  it('should return undefined when datasetDomain is undefined', () => {
    const view: DetailViewConfigWithType = {
      type: 'detail',
      elements: [],
    };

    const result = computeDynamicParamsReplacement(
      undefined,
      view,
      stringReplacer,
      objectValueReplacer
    );

    expect(result).toBeUndefined();
  });

  it('should return undefined when view is undefined', () => {
    const result = computeDynamicParamsReplacement(
      'tourism',
      undefined,
      stringReplacer,
      objectValueReplacer
    );

    expect(result).toBeUndefined();
  });

  it('should return view unchanged for non-tourism domains', () => {
    const view: DetailViewConfigWithType = {
      type: 'detail',
      elements: [],
    };

    const result = computeDynamicParamsReplacement(
      'mobility',
      view,
      stringReplacer,
      objectValueReplacer
    );

    expect(result).toBe(view);
  });

  it('should replace {language} in objectMapping for detail view', () => {
    const view: DetailViewConfigWithType = {
      type: 'detail',
      elements: [
        {
          name: 'Test Category',
          slug: 'test',
          subcategories: [
            {
              name: 'Test Subcategory',
              properties: [
                {
                  title: 'Title',
                  component: 'StringCell',
                  objectMapping: {
                    text: 'Detail.{language}.Title',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    ) as DetailViewConfigWithType;

    expect(result.elements[0].subcategories[0].properties[0].objectMapping).toEqual({
      text: 'Detail.en.Title',
    });
  });

  it('should replace {language} in arrayMapping.pathToParent', () => {
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
                  title: 'Tags',
                  component: 'ArrayCell',
                  arrayMapping: {
                    pathToParent: 'Detail.{language}.Tags',
                    targetPropertyName: 'tags',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    ) as DetailViewConfigWithType;

    expect(
      result.elements[0].subcategories[0].properties[0].arrayMapping?.pathToParent
    ).toBe('Detail.en.Tags');
  });

  it('should replace in arrayMapping.objectMapping', () => {
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
                  title: 'Items',
                  component: 'EditListCell',
                  arrayMapping: {
                    pathToParent: 'Items',
                    targetPropertyName: 'items',
                    objectMapping: {
                      title: 'Detail.{language}.Title',
                      description: 'Detail.{language}.Description',
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    ) as DetailViewConfigWithType;

    expect(
      result.elements[0].subcategories[0].properties[0].arrayMapping?.objectMapping
    ).toEqual({
      title: 'Detail.en.Title',
      description: 'Detail.en.Description',
    });
  });

  it('should recursively replace in nested properties', () => {
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
                  title: 'Roads',
                  component: 'EditNestedArrayCell',
                  arrayMapping: {
                    pathToParent: 'Roads',
                    targetPropertyName: 'roads',
                    properties: [
                      {
                        title: 'Name',
                        component: 'StringCell',
                        objectMapping: {
                          text: 'Detail.{language}.Name',
                        },
                      },
                      {
                        title: 'Lanes',
                        component: 'EditNestedArrayCell',
                        arrayMapping: {
                          pathToParent: 'Lanes',
                          targetPropertyName: 'lanes',
                          properties: [
                            {
                              title: 'Lane Name',
                              component: 'StringCell',
                              objectMapping: {
                                text: 'Detail.{language}.LaneName',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    ) as DetailViewConfigWithType;

    const roadProperty = result.elements[0].subcategories[0].properties[0];
    const nameProperty = roadProperty.arrayMapping?.properties?.[0];
    const lanesProperty = roadProperty.arrayMapping?.properties?.[1];
    const laneNameProperty = lanesProperty?.arrayMapping?.properties?.[0];

    expect(nameProperty?.objectMapping).toEqual({
      text: 'Detail.en.Name',
    });
    expect(laneNameProperty?.objectMapping).toEqual({
      text: 'Detail.en.LaneName',
    });
  });

  it('should clear objectMapping when processing properties array', () => {
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
                  title: 'Items',
                  component: 'EditNestedArrayCell',
                  arrayMapping: {
                    pathToParent: 'Items',
                    targetPropertyName: 'items',
                    properties: [
                      {
                        title: 'Name',
                        component: 'StringCell',
                        objectMapping: {
                          text: 'name',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    ) as DetailViewConfigWithType;

    const itemsProperty = result.elements[0].subcategories[0].properties[0];
    expect(itemsProperty.objectMapping).toBeUndefined();
    expect(itemsProperty.arrayMapping?.properties).toBeDefined();
  });

  it('should handle raw view without changes', () => {
    const view = {
      type: 'raw' as const,
      elements: [],
    };

    const result = computeDynamicParamsReplacement(
      'tourism',
      view,
      stringReplacer,
      objectValueReplacer
    );

    expect(result).toBe(view);
  });
});
