// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  dataStatesSubCategory,
  tagCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  licenseInfoCategory,
  mappingCategory,
  idReadOnlyCell,
} from '../../builder/tourism';
import { geoDataCategory } from '../../builder/tourism/geoData';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { withOdhBaseUrl } from '../../utils';

export const testdataSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    // ============================================
    // MAIN DATA CATEGORY
    // ============================================
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [
            shortnameCell(),
            {
              title: 'Title',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.Title' },
            },
            {
              title: 'Base Text',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Detail.{language}.BaseText' },
              class: 'break-all',
            },
          ],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('testdata'),
      ],
    },

    // ============================================
    // FOO CATEGORY - FirstLevelNesting object
    // Tests nested arrays within an object
    // ============================================
    {
      name: 'Foo (FirstLevelNesting)',
      slug: 'foo',
      subcategories: [
        // Foo.Valid - array of ValidStruct
        {
          name: 'Foo.Valid (array)',
          properties: [
            {
              title: 'Valid Items',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'fooValid',
                pathToParent: 'Foo.Valid',
                properties: [
                  {
                    title: 'ValidSource',
                    component: CellComponent.InputReferenceCell,
                    objectMapping: { value: 'ValidSource' },
                    params: {
                      url: withOdhBaseUrl('/v1/Source?pagesize=-1'),
                      labelSelector: 'Name.{language}',
                      keySelector: 'Key',
                    },
                  },
                  {
                    title: 'DeprecatedLeaf (deprecated)',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'DeprecatedLeaf' },
                  },
                  {
                    title: 'Nested Detail Title',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'NestedDetail.{language}.Title' },
                  },
                  {
                    title: 'Nested Detail BaseText',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'NestedDetail.{language}.BaseText' },
                  },
                  {
                    title: 'NestedDeprecatedLeafDetail (deprecated)',
                    component: CellComponent.StringCell,
                    objectMapping: {
                      text: 'NestedDeprecatedLeafDetail.{language}.BaseText',
                    },
                  },
                ],
              },
            },
          ],
        },
        // Foo.Deprecated - array of DeprecatedStruct (deprecated)
        {
          name: 'Foo.Deprecated (deprecated array)',
          properties: [
            {
              title: 'Deprecated Items',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'fooDeprecated',
                pathToParent: 'Foo.Deprecated',
                properties: [
                  {
                    title: 'DeprecatedSource (deprecated)',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'DeprecatedSource' },
                  },
                  {
                    title: 'NestedDeprecatedDetail Title',
                    component: CellComponent.StringCell,
                    objectMapping: {
                      text: 'NestedDeprecatedDetail.{language}.Title',
                    },
                  },
                  {
                    title: 'NestedDeprecatedDetail BaseText',
                    component: CellComponent.StringCell,
                    objectMapping: {
                      text: 'NestedDeprecatedDetail.{language}.BaseText',
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    // ============================================
    // FOO DEPRECATED CATEGORY (deprecated)
    // Tests deprecated object with nested arrays
    // ============================================
    {
      name: 'FooDeprecated (deprecated)',
      slug: 'foo-deprecated',
      subcategories: [
        {
          name: 'FooDeprecated.Valid',
          properties: [
            {
              title: 'Valid Items in Deprecated Parent',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'fooDeprecatedValid',
                pathToParent: 'FooDeprecated.Valid',
                properties: [
                  {
                    title: 'ValidSource . . .',
                    component: CellComponent.InputReferenceCell,
                    objectMapping: { value: 'ValidSource' },
                    params: {
                      url: withOdhBaseUrl('/v1/Source?pagesize=-1'),
                      labelSelector: 'Name.{language}',
                      keySelector: 'Key',
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'FooDeprecated.Deprecated',
          properties: [
            {
              title: 'Deprecated Items in Deprecated Parent',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'fooDeprecatedDeprecated',
                pathToParent: 'FooDeprecated.Deprecated',
                properties: [
                  {
                    title: 'DeprecatedSource',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'DeprecatedSource' },
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    // ============================================
    // LORE IPSUM CATEGORY - Array of FirstLevelNesting
    // Tests array of objects containing nested arrays (3 levels deep)
    // ============================================
    {
      name: 'LoreIpsum (array of FirstLevelNesting)',
      slug: 'lore-ipsum',
      subcategories: [
        {
          name: 'LoreIpsum Items',
          properties: [
            {
              title: 'LoreIpsum',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'loreIpsum',
                pathToParent: 'LoreIpsum',
                properties: [
                  // Each LoreIpsum item contains Valid array (nested array within array)
                  {
                    title: 'Valid (nested array)',
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'valid',
                      pathToParent: 'Valid',
                      properties: [
                        {
                          title: 'ValidSource',
                          component: CellComponent.InputReferenceCell,
                          objectMapping: { value: 'ValidSource' },
                          params: {
                            url: withOdhBaseUrl('/v1/Source?pagesize=-1'),
                            labelSelector: 'Name.{language}',
                            keySelector: 'Key',
                          },
                        },
                        {
                          title: 'DeprecatedLeaf (deprecated)',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'DeprecatedLeaf' },
                        },
                      ],
                    },
                  },
                  // Each LoreIpsum item contains Deprecated array (deprecated nested array)
                  {
                    title: 'Deprecated (deprecated nested array)',
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'deprecated',
                      pathToParent: 'Deprecated',
                      properties: [
                        {
                          title: 'DeprecatedSource',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'DeprecatedSource' },
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

    // ============================================
    // LORE IPSUM DEPRECATED CATEGORY (deprecated)
    // Tests deprecated array of FirstLevelNesting
    // ============================================
    {
      name: 'LoreIpsumDeprecated (deprecated)',
      slug: 'lore-ipsum-deprecated',
      subcategories: [
        {
          name: 'LoreIpsumDeprecated Items',
          properties: [
            {
              title: 'LoreIpsumDeprecated',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'loreIpsumDeprecated',
                pathToParent: 'LoreIpsumDeprecated',
                properties: [
                  {
                    title: 'Valid (nested array in deprecated parent)',
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'valid',
                      pathToParent: 'Valid',
                      properties: [
                        {
                          title: 'ValidSource',
                          component: CellComponent.InputReferenceCell,
                          objectMapping: { value: 'ValidSource' },
                          params: {
                            url: withOdhBaseUrl('/v1/Source?pagesize=-1'),
                            labelSelector: 'Name.{language}',
                            keySelector: 'Key',
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

    // ============================================
    // ADDITIONAL PROPERTIES CATEGORY
    // Tests polymorphic dictionary with nested arrays
    // ============================================
    {
      name: 'AdditionalProperties',
      slug: 'additional-properties',
      subcategories: [
        {
          name: 'TestadataProperties',
          properties: [
            {
              title: 'TestadataProperties.Valid',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'additionalValid',
                pathToParent: 'AdditionalProperties.TestadataProperties.Valid',
                properties: [
                  {
                    title: 'ValidSource',
                    component: CellComponent.InputReferenceCell,
                    objectMapping: { value: 'ValidSource' },
                    params: {
                      url: withOdhBaseUrl('/v1/Source?pagesize=-1'),
                      labelSelector: 'Name.{language}',
                      keySelector: 'Key',
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    // ============================================
    // STANDARD CATEGORIES
    // ============================================
    geoDataCategory(),
    tagCategory(''),
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
