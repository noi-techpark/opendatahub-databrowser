// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * EXAMPLE: Nested Array Property Mapping
 *
 * This file demonstrates the new nested array property mapping feature
 * that allows you to configure how individual fields within array items
 * should be rendered, without creating custom components.
 *
 * @see Phase 1 Implementation (Feature: Nested Array Property Mapping)
 */

import { CellComponent } from '../../../domain/cellComponents/types';
import { EditViewConfig } from '../../../domain/datasets/config/types';

/**
 * Example data structure we're configuring:
 *
 * {
 *   "RoadInfo": [
 *     {
 *       "Name": { "en": "Highway 1", "de": "Autobahn 1", "it": "Autostrada 1" },
 *       "GpsInfo": { "Latitude": 46.5, "Longitude": 11.3 },
 *       "Tags": ["scenic", "mountain", "toll"]
 *     },
 *     {
 *       "Name": { "en": "Mountain Pass", "de": "Bergpass", "it": "Passo di montagna" },
 *       "GpsInfo": { "Latitude": 46.8, "Longitude": 11.1 },
 *       "Tags": ["scenic", "winding"]
 *     }
 *   ]
 * }
 */

export const nestedArrayExampleView: EditViewConfig = {
  elements: [
    {
      name: 'Road Information',
      slug: 'road-info',
      subcategories: [
        {
          name: 'Roads',
          properties: [
            /**
             * EXAMPLE 1: Basic Nested Array with Multiple Fields
             *
             * Before: Would require a custom component like CustomRoadEditor.vue
             * After: Can configure declaratively using properties array
             */
            {
              title: 'Roads',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'roads',
                pathToParent: 'RoadInfo',
                // NEW: properties array defines how to render each field in array items
                properties: [
                  {
                    title: 'Road Name',
                    component: CellComponent.StringCell,
                    // Language selector works inside arrays!
                    objectMapping: { text: 'Name.{language}' },
                  },
                  {
                    title: 'GPS Location',
                    component: CellComponent.EditGpsInfoCell,
                    objectMapping: {
                      latitude: 'GpsInfo.Latitude',
                      longitude: 'GpsInfo.Longitude',
                    },
                  },
                  {
                    title: 'Tags',
                    component: CellComponent.ArrayCell,
                    objectMapping: { items: 'Tags' },
                    params: { separator: ', ' },
                  },
                ],
              },
            },

            /**
             * EXAMPLE 2: Nested Arrays (Arrays within Arrays)
             *
             * Data structure:
             * {
             *   "ImageGallery": [
             *     {
             *       "ImageTitle": { "en": "Sunset", "de": "Sonnenuntergang" },
             *       "ImageUrl": "https://...",
             *       "Tags": ["nature", "scenic"]
             *     }
             *   ]
             * }
             */
            {
              title: 'Image Gallery',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'images',
                pathToParent: 'ImageGallery',
                properties: [
                  {
                    title: 'Image Title',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'ImageTitle.{language}' },
                  },
                  {
                    title: 'Image URL',
                    component: CellComponent.ImageCell,
                    objectMapping: { src: 'ImageUrl' },
                  },
                  {
                    title: 'Image Tags',
                    // Nested array! EditNestedArrayCell can be used recursively
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'tags',
                      pathToParent: 'Tags',
                      // Simple array of strings - no properties needed
                      objectMapping: undefined,
                    },
                  },
                ],
              },
            },

            /**
             * EXAMPLE 3: Complex Nested Structure
             *
             * Data structure:
             * {
             *   "EventSchedule": [
             *     {
             *       "EventDate": "2025-01-20",
             *       "EventTitle": { "en": "Conference", "de": "Konferenz" },
             *       "Speakers": [
             *         {
             *           "Name": "John Doe",
             *           "Bio": { "en": "...", "de": "..." }
             *         }
             *       ]
             *     }
             *   ]
             * }
             */
            {
              title: 'Event Schedule',
              component: CellComponent.EditNestedArrayCell,
              arrayMapping: {
                targetPropertyName: 'events',
                pathToParent: 'EventSchedule',
                properties: [
                  {
                    title: 'Event Date',
                    component: CellComponent.DateCell,
                    objectMapping: { date: 'EventDate' },
                  },
                  {
                    title: 'Event Title',
                    component: CellComponent.StringCell,
                    objectMapping: { text: 'EventTitle.{language}' },
                  },
                  {
                    title: 'Speakers',
                    // Deeply nested array!
                    component: CellComponent.EditNestedArrayCell,
                    arrayMapping: {
                      targetPropertyName: 'speakers',
                      pathToParent: 'Speakers',
                      properties: [
                        {
                          title: 'Speaker Name',
                          component: CellComponent.StringCell,
                          objectMapping: { text: 'Name' },
                        },
                        {
                          title: 'Speaker Bio',
                          component: CellComponent.TextAreaCell,
                          objectMapping: { text: 'Bio.{language}' },
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

/**
 * MIGRATION GUIDE: Converting Custom Components to Nested Properties
 *
 * Before (Custom Component Required):
 * ```typescript
 * {
 *   title: 'Roads',
 *   component: 'custom-road-editor',  // ❌ Custom component needed
 *   arrayMapping: {
 *     pathToParent: 'RoadInfo',
 *     objectMapping: {  // ⚠️ Can only flatten, no component control
 *       name: 'Name',
 *       gps: 'GpsInfo',
 *       tags: 'Tags'
 *     }
 *   }
 * }
 * // Then create CustomRoadEditor.vue manually
 * ```
 *
 * After (Declarative Configuration):
 * ```typescript
 * {
 *   title: 'Roads',
 *   component: CellComponent.EditNestedArrayCell,  // ✅ Generic component
 *   arrayMapping: {
 *     pathToParent: 'RoadInfo',
 *     properties: [  // ✅ Declare nested rendering
 *       {
 *         title: 'Road Name',
 *         component: CellComponent.StringCell,
 *         objectMapping: { text: 'Name.{language}' }  // ✅ Language selector works!
 *       },
 *       {
 *         title: 'GPS',
 *         component: CellComponent.EditGpsInfoCell,  // ✅ Use existing components
 *         objectMapping: { latitude: 'GpsInfo.Latitude', longitude: 'GpsInfo.Longitude' }
 *       }
 *     ]
 *   }
 * }
 * ```
 *
 * IMPORTANT NOTES:
 *
 * 1. Mutual Exclusivity: objectMapping and properties are mutually exclusive
 *    - Use objectMapping for simple flat mapping
 *    - Use properties for nested component rendering
 *
 * 2. Update Propagation: EditNestedArrayCell handles all update merging
 *    - Preserves other fields in array items (e.g., other languages)
 *    - Uses Ramda's assocPath for immutable updates
 *
 * 3. Language Selectors: Work correctly inside nested arrays
 *    - {language} placeholder is replaced at all nesting levels
 *
 * 4. Performance: Each property renders a separate component per array item
 *    - For large arrays (100+ items), consider pagination or virtualization
 *
 * 5. Validation: Development mode automatically validates configurations
 *    - Warns about mutually exclusive objectMapping/properties
 *    - Checks for required fields (title, component)
 *    - Validates recursive nested arrays
 */
