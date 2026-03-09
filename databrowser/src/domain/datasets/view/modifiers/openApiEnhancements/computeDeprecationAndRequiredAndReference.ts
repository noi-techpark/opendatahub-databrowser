// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { OpenAPIV3 } from 'openapi-types';
import { DomainWithOpenApiDocument } from '../../../../openApi';
import {
  ArrayMapping,
  DatasetPath,
  Deprecation,
  DeprecationInfo,
  ObjectMapping,
  PropertyConfig,
  ReferenceInfo,
  SubCategoryElement,
} from '../../../config/types';
import {
  ListViewConfigWithType,
  SingleRecordViewConfigWithType,
  ViewConfigWithType,
} from '../../types';
import { getSchema, getSchemasForPath } from './openApiUtils';

export const computeViewWithOpenApiEnhancements = (
  doc: OpenAPIV3.Document,
  domain: DomainWithOpenApiDocument,
  datasetPath: DatasetPath,
  view: ViewConfigWithType
): ViewConfigWithType => {
  const schema = getSchema(doc, domain, datasetPath, view.type);

  if (schema == null) {
    console.log(
      `No schema found in OpenAPI spec for domain ${domain}, path ${datasetPath} and view ${view.type}.`
    );
    return view;
  }

  switch (view.type) {
    case 'table':
      return computeTableView(schema, view);
    case 'raw':
      return view;
    default:
      return computeSingleRecordView(schema, view);
  }
};

const computeTableView = (
  schema: OpenAPIV3.SchemaObject,
  view: ListViewConfigWithType
) => {
  return view.elements.reduce<ListViewConfigWithType>(
    (prev, element) => {
      return {
        ...prev,
        elements: [
          ...prev.elements,
          {
            ...element,
            // Add deprecation and required information to the element
            ...getDeprecationAndRequired(schema, element),
          },
        ],
      };
    },
    { elements: [], type: 'table' }
  );
};

const computeSingleRecordView = (
  schema: OpenAPIV3.SchemaObject,
  view: SingleRecordViewConfigWithType
): ViewConfigWithType => {
  return view.elements.reduce<SingleRecordViewConfigWithType>(
    (prev, element) => {
      const subcategories = element.subcategories?.map<SubCategoryElement>(
        (subcategory) => {
          const properties = subcategory.properties.map<PropertyConfig>(
            (property) => enhancePropertyWithOpenApi(schema, property)
          );

          return {
            ...subcategory,
            properties,
          };
        }
      );

      return {
        ...prev,
        elements: [
          ...prev.elements,
          {
            ...element,
            subcategories,
          },
        ],
      };
    },
    { elements: [], type: view.type }
  );
};

/**
 * Recursively enhance a property with OpenAPI information (deprecation, reference, required).
 * This also processes nested properties inside arrayMapping.properties.
 *
 * @param schema - The root OpenAPI schema
 * @param property - The property config to enhance
 * @param parentPath - The path prefix from parent arrayMappings (for nested properties)
 */
const enhancePropertyWithOpenApi = (
  schema: OpenAPIV3.SchemaObject,
  property: PropertyConfig,
  parentPath: string = ''
): PropertyConfig => {
  // Create the effective property with adjusted paths for nested context
  const effectiveProperty = createEffectiveProperty(property, parentPath);

  // Get base enhancements for this property
  const referenceInfo = getReferenceInfo(effectiveProperty);
  const deprecationAndRequired = getDeprecationAndRequired(
    schema,
    effectiveProperty
  );

  // If this property has nested arrayMapping.properties, recursively enhance them
  let enhancedArrayMapping = property.arrayMapping;
  if (property.arrayMapping?.properties != null) {
    // Calculate the nested path prefix for child properties
    // e.g., if parent pathToParent is "Foo.Valid" and this arrayMapping pathToParent is "Nested",
    // the full path for nested properties is "Foo.Valid.[].Nested.[]."
    const nestedParentPath = parentPath
      ? `${parentPath}.[].${property.arrayMapping.pathToParent}`
      : property.arrayMapping.pathToParent;

    const enhancedNestedProperties = property.arrayMapping.properties.map(
      (nestedProp) => enhancePropertyWithOpenApi(schema, nestedProp, nestedParentPath)
    );

    enhancedArrayMapping = {
      ...property.arrayMapping,
      properties: enhancedNestedProperties,
    };
  }

  // Only include arrayMapping if original property had it (objectMapping and arrayMapping are mutually exclusive)
  if (property.objectMapping != null) {
    return {
      ...property,
      ...referenceInfo,
      ...deprecationAndRequired,
    };
  }

  return {
    ...property,
    ...referenceInfo,
    ...deprecationAndRequired,
    arrayMapping: enhancedArrayMapping,
  } as PropertyConfig;
};

/**
 * Create an effective property with paths adjusted for nested context.
 * This ensures deprecation/reference lookups use the full path from root.
 */
const createEffectiveProperty = (
  property: PropertyConfig,
  parentPath: string
): PropertyConfig => {
  if (!parentPath) {
    return property;
  }

  // Adjust objectMapping paths to include parent path
  if (property.objectMapping != null) {
    const adjustedObjectMapping: ObjectMapping = {};
    for (const [key, value] of Object.entries(property.objectMapping)) {
      // Prepend parent path: "Name" -> "Foo.Valid.[].Name"
      adjustedObjectMapping[key] = `${parentPath}.[].${value}`;
    }
    return {
      ...property,
      objectMapping: adjustedObjectMapping,
    };
  }

  // Adjust arrayMapping pathToParent to include parent path
  if (property.arrayMapping != null) {
    return {
      ...property,
      arrayMapping: {
        ...property.arrayMapping,
        pathToParent: `${parentPath}.[].${property.arrayMapping.pathToParent}`,
      },
    };
  }

  return property;
};

const getReferenceInfo = (
  property: PropertyConfig
): { referenceInfo?: ReferenceInfo } => {
  const propertyParams = property.params;

  if (!propertyParams || !propertyParams.url) return {};

  return {
    referenceInfo: {
      from:
        property.objectMapping?.value ||
        property.arrayMapping?.pathToParent ||
        property.objectMapping?.items,
      origin: propertyParams.url.match(/\/v\d+\/([^/?]+)/)?.[1] || '', // Example: https://api.tourism.testingmachine.eu/v1/Municipality?removenullvalues=falseThis regex is designed to extract the resource name (in this case, "Municipality") that appears after the version number (e.g., /v1/) in a URL, while ignoring any query parameters or additional paths.
      url: propertyParams.url,
      referenceDetailViewUrls: [],
    },
  };
};

const getDeprecationAndRequired = (
  rootSchema: OpenAPIV3.SchemaObject,
  mapping: {
    objectMapping?: ObjectMapping;
    arrayMapping?: ArrayMapping;
    required?: boolean;
  }
) => {
  const {
    objectMapping,
    arrayMapping,
    required: isRequiredFromConfig,
  } = mapping;

  // Check which kind of mapping is used
  const efectiveMapping = objectMapping ?? arrayMapping?.objectMapping ?? {};

  // Check if the mapping is an object mapping or an array mapping
  // If it is an array mapping, the path must be constructed as follows:
  // 'Images.0.Url' -> 'Images.[].Url', where 'Images' is the path to the
  // parent and 'Url' is the property name
  const pathToParent =
    objectMapping != null ? '' : `${arrayMapping?.pathToParent}.[].`;

  // For arrayMapping with properties (nested arrays), check if the array path itself is deprecated
  // This handles EditNestedArrayCell where there's no objectMapping
  const isArrayMappingOnly =
    objectMapping == null &&
    arrayMapping != null &&
    (arrayMapping.objectMapping == null ||
      Object.keys(arrayMapping.objectMapping).length === 0);

  if (isArrayMappingOnly && arrayMapping?.pathToParent) {
    const arrayPath = arrayMapping.pathToParent;
    const propertyPathAsArray = arrayPath.split('.');
    const schemasForPath = getSchemasForPath(rootSchema, propertyPathAsArray);

    const deprecations = schemasForPath
      .filter(({ schema }) => schema.deprecated === true)
      .map<Deprecation>(({ schema, pathFromRoot }) => ({
        description: schema.description ?? '',
        pathToDeprecation: pathFromRoot,
      }));

    if (deprecations.length > 0) {
      return {
        deprecationInfo: [{ propertyPath: arrayPath, deprecations }],
        required: false,
      };
    }
  }

  return Object.values(efectiveMapping ?? {}).reduce<{
    deprecationInfo: DeprecationInfo[];
    required: boolean;
  }>(
    (prev, value) => {
      const fullPath = pathToParent + value;
      // Get the property path as array, e.g. from 'Images.0.Url' to ['Images', '0', 'Url']
      const propertyPathAsArray = fullPath.split('.');

      // Get the all schemas for the property path
      const schemasForPath = getSchemasForPath(rootSchema, propertyPathAsArray);

      // Get all deprecations from the schemas. Note that there may be multiple
      // deprecations for a single property because elements on the path to the
      // property may be deprecated which also deprecates the property itself.
      // For example, if 'Images' is deprecated, then 'Images.0.Url' is also
      // deprecated.
      const deprecations = schemasForPath
        .filter(({ schema }) => schema.deprecated === true)
        .map<Deprecation>(({ schema, pathFromRoot }) => ({
          description: schema.description ?? '',
          pathToDeprecation: pathFromRoot,
        }));

      // If the property is deprecated, add it to the deprecation info
      // This allows us to show detailed deprecation warnings in the UI
      const deprecationInfo: DeprecationInfo[] =
        deprecations.length === 0
          ? prev.deprecationInfo
          : [
              ...prev.deprecationInfo,
              {
                propertyPath: fullPath,
                deprecations,
              },
            ];

      // Compute required information
      const isAnySchemaRequired =
        schemasForPath.filter((subSchema) => subSchema.schema.required).length >
        0;

      const required = isRequiredFromConfig ?? isAnySchemaRequired;

      return { deprecationInfo, required };
    },
    { deprecationInfo: [], required: false }
  );
};
